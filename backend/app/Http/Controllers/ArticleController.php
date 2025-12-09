<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\ArticleInteraction;
use App\Models\Log;
use App\Models\Author;
use App\Models\User;
use App\Models\SearchLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ArticleRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Article::with(['author', 'categories', 'tags']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            } else {
                $query->where('status', 'published');
            }

            $query->orderBy('published_at', 'desc');

            // Filter by category if provided
            if ($request->has('category') && $request->category) {
                $query->whereHas('categories', function ($q) use ($request) {
                    $q->where('name', 'LIKE', '%' . $request->category . '%');
                });
            }

            $limit = $request->get('limit', 10);
            $articles = $query->paginate($limit);

            return response()->json($articles);
        } catch (\Exception $e) {
            return response()->json(['data' => []]);
        }
    }

    public function create()
    {
        $categories = Category::all();
        $tags = Tag::all();
        return view('articles.create', compact('categories', 'tags'));
    }

    public function store(ArticleRequest $request)
    {
        try {
            $this->authorize('create', Article::class);

            $validated = $request->validated();

            // Admin/Moderator creates articles
            $user = Auth::user();

            // Resolve author by provided 'author_name' or 'author'
            $authorName = $validated['author_name'] ?? ($validated['author'] ?? $user->name);
            $author = Author::firstOrCreate(
                ['name' => $authorName],
                ['user_id' => $user->id]
            );

            $imagePath = null;
            if ($request->hasFile('featured_image')) {
                try {
                    $uploadedFile = cloudinary()->uploadApi()->upload($request->file('featured_image')->getRealPath(), [
                        'folder' => 'laverdad-herald/articles'
                    ]);
                    $imagePath = $uploadedFile['secure_url'];
                } catch (\Exception $e) {
                    Log::error('Cloudinary upload failed: ' . $e->getMessage());
                    $image = $request->file('featured_image');
                    $imageName = time() . '.' . $image->getClientOriginalExtension();
                    $image->move(public_path('storage/articles'), $imageName);
                    $imagePath = '/storage/articles/' . $imageName;
                }
            }

            $status = $request->get('status', 'published');
            $article = Article::create([
                'title' => $validated['title'],
                'slug' => Str::slug($validated['title']),
                'content' => $validated['content'],
                'author_id' => $author->id,
                'status' => $status,
                'published_at' => $status === 'published' ? now() : null,
                'excerpt' => Str::limit(strip_tags($validated['content']), 150),
                'featured_image' => $imagePath,
            ]);

            // Resolve category by id or name
            if (!empty($validated['category_id'])) {
                $article->categories()->attach($validated['category_id']);
            } elseif (!empty($validated['category'])) {
                $category = Category::where('name', $validated['category'])->first();
                if ($category) {
                    $article->categories()->attach($category->id);
                }
            }

            if (!empty($validated['tags'])) {
                $tagIds = [];
                $tags = explode(',', $validated['tags']);
                foreach ($tags as $tagName) {
                    $tagName = trim($tagName);
                    if (!empty($tagName)) {
                        $tag = Tag::firstOrCreate(['name' => $tagName]);
                        $tagIds[] = $tag->id;
                    }
                }
                if (!empty($tagIds)) {
                    $article->tags()->sync($tagIds);
                }
            }

            Log::create([
                'user_id' => Auth::id(),
                'action' => 'created',
                'model_type' => 'Article',
                'model_id' => $article->id,
                'new_values' => $article->toArray(),
            ]);

            return response()->json($article->load('author.user', 'categories', 'tags'), 201);
        } catch (\Exception $e) {
            Log::error('Article creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create article'], 500);
        }
    }

    public function show(Article $article)
    {
        try {
            if (request()->wantsJson()) {
                $article->load('author.user', 'categories', 'tags');
                $article->loadCount(['interactions as likes_count' => function ($query) {
                    $query->where('type', 'like');
                }]);
                if (Auth::check()) {
                    $article->is_liked = $article->interactions->where('user_id', Auth::id())->where('type', 'like')->isNotEmpty();
                }
                return response()->json($article);
            }
            return view('articles.show', compact('article'));
        } catch (\Exception $e) {
            Log::error('Error in ArticleController@show: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to load article'], 500);
        }
    }

    public function edit(Article $article)
    {
        $categories = Category::all();
        $tags = Tag::all();
        return view('articles.edit', compact('article', 'categories', 'tags'));
    }

    public function update(ArticleRequest $request, Article $article)
    {
        $validated = $request->validated();

        // Authorize using policy (admins and moderators may update per policy)
        $this->authorize('update', $article);

        // Resolve author by provided 'author_name' or 'author'
        $authorName = $validated['author_name'] ?? ($validated['author'] ?? Auth::user()->name);
        $author = Author::firstOrCreate(
            ['name' => $authorName], 
            ['user_id' => Auth::id()]
        );

        // Keep the original slug to maintain URL consistency
        $slug = $article->slug;

        // Update article data
        $data = [
            'title' => $validated['title'],
            'content' => $validated['content'],
            'author_id' => $author->id,
            'slug' => $slug,
            'excerpt' => Str::limit(strip_tags($validated['content']), 150),
        ];
        
        // Handle status update
        if ($request->has('status')) {
            // Check if trying to publish
            if ($request->status === 'published' && $article->status !== 'published') {
                $this->authorize('publish', $article);
            }
            $data['status'] = $request->status;
            if ($request->status === 'published' && !$article->published_at) {
                $data['published_at'] = now();
            }
        }

        if ($request->hasFile('featured_image')) {
            try {
                $uploadedFile = cloudinary()->uploadApi()->upload($request->file('featured_image')->getRealPath(), [
                    'folder' => 'laverdad-herald/articles'
                ]);
                $data['featured_image'] = $uploadedFile['secure_url'];
            } catch (\Exception $e) {
                Log::error('Cloudinary upload failed: ' . $e->getMessage());
                $image = $request->file('featured_image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('storage/articles'), $imageName);
                $data['featured_image'] = '/storage/articles/' . $imageName;
            }
        }

        $article->update($data);

        // Handle category
        if (!empty($validated['category_id'])) {
            $article->categories()->sync([$validated['category_id']]);
        } elseif (!empty($validated['category'])) {
            $category = Category::where('name', $validated['category'])->first();
            if ($category) {
                $article->categories()->sync([$category->id]);
            }
        }

        // Handle tags
        if ($request->has('tags') && $request->tags) {
            $tags = explode(',', $request->tags);
            $tagIds = [];
            foreach ($tags as $tagName) {
                $tagName = trim($tagName);
                if (!empty($tagName)) {
                    $tag = Tag::firstOrCreate(['name' => $tagName]);
                    $tagIds[] = $tag->id;
                }
            }
            if (!empty($tagIds)) {
                $article->tags()->sync($tagIds);
            }
        }

        Log::create([
            'user_id' => Auth::id(),
            'action' => 'updated',
            'model_type' => 'Article',
            'model_id' => $article->id,
            'old_values' => $article->getOriginal(),
            'new_values' => $article->toArray(),
        ]);

        return response()->json($article->load('author.user', 'categories', 'tags'));
    }

    public function destroy(Article $article)
    {
        try {
            $this->authorize('delete', $article);

            $article->categories()->detach();
            $article->tags()->detach();
            $article->interactions()->delete();
            $article->delete();

            Log::create([
                'user_id' => Auth::id(),
                'action' => 'deleted',
                'model_type' => 'Article',
                'model_id' => $article->id,
                'old_values' => $article->toArray(),
            ]);

            return response()->json(['message' => 'Article deleted successfully']);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized. Only admins can delete articles.'], 403);
        } catch (\Exception $e) {
            Log::error('Article deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete article'], 500);
        }
    }

    public function like(Article $article)
    {
        try {
            if (!Auth::check()) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $existing = ArticleInteraction::where('user_id', Auth::id())
                ->where('article_id', $article->id)
                ->where('type', 'like')
                ->first();

            if ($existing) {
                $existing->delete();
                $count = ArticleInteraction::where('article_id', $article->id)->where('type', 'like')->count();
                return response()->json(['liked' => false, 'likes_count' => $count]);
            }

            ArticleInteraction::create([
                'user_id' => Auth::id(),
                'article_id' => $article->id,
                'type' => 'like',
                'ip_address' => request()->ip()
            ]);

            $count = ArticleInteraction::where('article_id', $article->id)->where('type', 'like')->count();
            return response()->json(['liked' => true, 'likes_count' => $count]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to like article'], 500);
        }
    }

    public function share(Article $article)
    {
        ArticleInteraction::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'article_id' => $article->id,
                'type' => 'shared',
            ],
            []
        );

        return back()->with('success', 'Article shared!');
    }

    public function getLikedArticles(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $articles = Article::whereHas('interactions', function ($query) {
            $query->where('user_id', Auth::id())
                  ->where('type', 'like');
        })
        ->with('author.user', 'categories', 'tags')
        ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($articles);
    }

    public function getSharedArticles(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $articles = Article::whereHas('interactions', function ($query) {
            $query->where('user_id', Auth::id())
                  ->where('type', 'shared');
        })
        ->with('author.user', 'categories', 'tags')
        ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($articles);
    }

    public function getArticlesByAuthor(Request $request, $authorId)
    {
        $author = Author::find($authorId);
        if (!$author) {
            return response()->json(['error' => 'Author not found'], 404);
        }

        $query = Article::where('author_id', $authorId)->with('author.user', 'categories', 'tags');

        if (Auth::check()) {
            // Authenticated users can see all articles
            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }
        } else {
            // Unauthenticated users can only see published articles
            $query->published();
        }

        $query->latest('published_at');

        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);
        $articles = $query->paginate($perPage, ['*'], 'page', $page);

        // Add article count to response
        $articleCount = Article::where('author_id', $authorId)->count();

        return response()->json([
            'articles' => $articles,
            'article_count' => $articleCount,
            'author' => $author->load('user')
        ]);
    }

    public function search(Request $request)
    {
        try {
            $query = $request->get('q', '');

            if (strlen(trim($query)) < 3) {
                return response()->json(['data' => []]);
            }

            $searchTerm = '%' . $query . '%';
            $articles = Article::where('status', 'published')
                ->with(['author', 'categories', 'tags'])
                ->where(function($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', $searchTerm)
                    ->orWhere('content', 'LIKE', $searchTerm)
                    ->orWhere('excerpt', 'LIKE', $searchTerm)
                    ->orWhereHas('tags', function($query) use ($searchTerm) {
                        $query->where('name', 'LIKE', $searchTerm);
                    })
                    ->orWhereHas('author', function($query) use ($searchTerm) {
                        $query->where('name', 'LIKE', $searchTerm);
                    })
                    ->orWhereHas('categories', function($query) use ($searchTerm) {
                        $query->where('name', 'LIKE', $searchTerm);
                    });
                })
                ->orderBy('published_at', 'desc')
                ->take(20)
                ->get()
                ->map(function($article) {
                    return [
                        'id' => $article->id,
                        'title' => $article->title,
                        'slug' => $article->slug,
                        'excerpt' => $article->excerpt,
                        'content' => $article->content,
                        'featured_image' => $article->featured_image,
                        'published_at' => $article->published_at,
                        'author_name' => $article->author->name ?? 'Unknown',
                        'categories' => $article->categories->map(function($cat) {
                            return ['name' => $cat->name];
                        }),
                        'tags' => $article->tags->pluck('name')
                    ];
                });

            // Optional search logging
            try {
                if (class_exists('App\Models\SearchLog')) {
                    SearchLog::create([
                        'user_id' => Auth::id(),
                        'query' => $query,
                        'results_count' => $articles->count(),
                        'ip_address' => $request->ip(),
                    ]);
                }
            } catch (\Exception $e) {
                // Ignore search log errors
            }

            return response()->json(['data' => $articles]);
        } catch (\Exception $e) {
            Log::error('Article search failed: ' . $e->getMessage());
            return response()->json(['data' => [], 'error' => 'Search failed'], 200);
        }
    }

    public function showBySlug($slug)
    {
        try {
            $article = Article::where('status', 'published')
                ->with(['author', 'categories', 'tags'])
                ->where('slug', $slug)
                ->first();

            if (!$article) {
                return response()->json(['error' => 'Article not found'], 404);
            }

            // Track view
            try {
                ArticleInteraction::firstOrCreate([
                    'user_id' => Auth::id() ?? null,
                    'article_id' => $article->id,
                    'type' => 'view',
                    'ip_address' => request()->ip()
                ]);
            } catch (\Exception $e) {
                // Ignore view tracking errors
            }

            // Load counts safely
            try {
                $article->loadCount([
                    'interactions as likes_count' => function ($query) {
                        $query->where('type', 'like');
                    },
                    'interactions as views_count' => function ($query) {
                        $query->where('type', 'view');
                    }
                ]);
            } catch (\Exception $e) {
                $article->likes_count = 0;
                $article->views_count = 0;
            }
            
            if (Auth::check()) {
                try {
                    $article->is_liked = $article->interactions->where('user_id', Auth::id())->where('type', 'like')->isNotEmpty();
                } catch (\Exception $e) {
                    $article->is_liked = false;
                }
            }

            return response()->json($article);
        } catch (\Exception $e) {
            Log::error('Article showBySlug failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to load article'], 500);
        }
    }

    public function showById($id)
    {
        $article = Article::published()->with('author.user', 'categories', 'tags')->find($id);
        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        // Track view
        try {
            ArticleInteraction::firstOrCreate([
                'user_id' => Auth::id() ?? null,
                'article_id' => $article->id,
                'type' => 'view',
                'ip_address' => request()->ip()
            ]);
        } catch (\Exception $e) {
            // Ignore view tracking errors
        }

        $article->loadCount([
            'interactions as likes_count' => function ($query) {
                $query->where('type', 'like');
            },
            'interactions as views_count' => function ($query) {
                $query->where('type', 'view');
            }
        ]);
        
        if (Auth::check()) {
            $article->is_liked = $article->interactions->where('user_id', Auth::id())->where('type', 'like')->isNotEmpty();
        }

        return response()->json($article);
    }

    public function latest(Request $request)
    {
        try {
            $articles = Article::where('status', 'published')
                ->with(['author', 'categories'])
                ->orderBy('published_at', 'desc')
                ->take(6)
                ->get();

            return response()->json($articles);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    public function publicIndex(Request $request)
    {
        $query = Article::published()->with('author.user', 'categories', 'tags');

        if ($request->has('category')) {
            $validated = $request->validate(['category' => 'string|max:255']);
            $query->whereHas('categories', function ($q) use ($validated) {
                $q->where('name', 'LIKE', '%' . $validated['category'] . '%');
            });
        }

        if ($request->has('latest') && $request->latest) {
            $limit = $request->get('limit', 9);
            $articles = $query->latest('published_at')->take($limit)->get();
            return response()->json($articles);
        }

        $limit = $request->get('limit', 10);
        $articles = $query->latest('published_at')->paginate($limit);

        return response()->json($articles);
    }
}
