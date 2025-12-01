<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\ArticleInteraction;
use App\Models\Author;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ArticleRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::with('author.user', 'categories', 'tags')->withCount('interactions');

        if (Auth::check()) {
            $user = Auth::user();
            // Admins and moderators can see all articles
            if ($user->isAdmin() || $user->isModerator()) {
                if ($request->has('status') && $request->status) {
                    $query->where('status', $request->status);
                }
            } else {
                // Regular users only see published articles
                $query->published();
            }
        } else {
            // Unauthenticated users can only see published articles
            $query->published();
        }

        $query->latest($request->status === 'draft' ? 'created_at' : 'published_at');

        // Filter by category if provided
        if ($request->has('category') && $request->category) {
            $validated = $request->validate(['category' => 'string|max:255']);
            $query->whereHas('categories', function ($q) use ($validated) {
                $q->where('name', $validated['category']);
            });
        }

        // Filter by limit if provided
        $limit = $request->get('limit', 10);
        $articles = $query->paginate($limit);

        if (Auth::check()) {
            $articles->getCollection()->transform(function ($article) {
                $article->is_liked = $article->interactions->where('user_id', Auth::id())->where('type', 'liked')->isNotEmpty();
                return $article;
            });
        }

        return response()->json($articles);
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

            // Find or create author by name
            $author = Author::firstOrCreate(
                ['name' => $validated['author_name']],
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

            $article->categories()->attach($validated['category_id']);

            if (!empty($validated['tags'])) {
                $tagIds = [];
                $tags = explode(',', $validated['tags']);
                foreach ($tags as $tagName) {
                    $tag = Tag::firstOrCreate(['name' => trim($tagName)]);
                    $tagIds[] = $tag->id;
                }
                $article->tags()->sync($tagIds);
            }

            return response()->json($article->load('author.user', 'categories', 'tags'), 201);
        } catch (\Exception $e) {
            Log::error('Article creation failed: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Article $article)
    {
        try {
            if (request()->wantsJson()) {
                $article->load('author.user', 'categories', 'tags')->loadCount('interactions');
                if (Auth::check()) {
                    $article->is_liked = $article->interactions->where('user_id', Auth::id())->where('type', 'liked')->isNotEmpty();
                }
                return response()->json($article);
            }
            return view('articles.show', compact('article'));
        } catch (\Exception $e) {
            Log::error('Error in ArticleController@show: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to load article: ' . $e->getMessage()], 500);
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

        // Find or create author by name
        $author = Author::firstOrCreate(
            ['name' => $validated['author_name']], 
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
        if ($request->has('category_id')) {
            $article->categories()->sync([$validated['category_id']]);
        }

        // Handle tags
        if ($request->tags) {
            $tags = explode(',', $request->tags);
            $tagIds = [];
            foreach ($tags as $tagName) {
                $tag = Tag::firstOrCreate(['name' => trim($tagName)]);
                $tagIds[] = $tag->id;
            }
            $article->tags()->sync($tagIds);
        }

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
            return response()->json(['error' => 'Failed to delete article: ' . $e->getMessage()], 500);
        }
    }

    public function like(Article $article)
    {
        $existing = ArticleInteraction::where('user_id', Auth::id())
            ->where('article_id', $article->id)
            ->where('type', 'liked')
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['liked' => false, 'likes_count' => $article->interactions()->where('type', 'liked')->count()]);
        }

        ArticleInteraction::create([
            'user_id' => Auth::id(),
            'article_id' => $article->id,
            'type' => 'liked',
        ]);

        return response()->json(['liked' => true, 'likes_count' => $article->interactions()->where('type', 'liked')->count()]);
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
                  ->where('type', 'liked');
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
            $validated = $request->validate(['q' => 'nullable|string|max:255']);
            $query = $validated['q'] ?? '';

            if (strlen(trim($query)) < 3) {
                return response()->json(['data' => []]);
            }

            $searchTerm = '%' . addslashes($query) . '%';
            $articles = Article::published()
                ->with('author.user', 'categories')
                ->where(function($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', $searchTerm)
                    ->orWhere('content', 'LIKE', $searchTerm)
                    ->orWhere('excerpt', 'LIKE', $searchTerm);
                })
                ->latest('published_at')
                ->take(20)
                ->get();

            return response()->json(['data' => $articles]);
        } catch (\Exception $e) {
            Log::error('Article search failed: ' . $e->getMessage());
            return response()->json(['data' => []], 500);
        }
    }

    public function showBySlug($slug)
    {
        $article = Article::published()
            ->with('author.user', 'categories', 'tags')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($article);
    }

    public function showById($id)
    {
        $article = Article::published()->with('author.user', 'categories', 'tags')->find($id);
        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        return response()->json($article);
    }

    public function latest(Request $request)
    {
        $articles = Article::published()
            ->with('author.user', 'categories')
            ->latest('published_at')
            ->take(6)
            ->get();

        return response()->json($articles);
    }

    public function publicIndex(Request $request)
    {
        $query = Article::published()->with('author.user', 'categories', 'tags');

        if ($request->has('category')) {
            $validated = $request->validate(['category' => 'string|max:255']);
            $query->whereHas('categories', function ($q) use ($validated) {
                $q->where('name', $validated['category']);
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
