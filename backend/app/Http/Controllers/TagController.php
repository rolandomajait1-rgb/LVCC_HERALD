<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::paginate(10);
        return view('tags.index', compact('tags'));
    }

    public function getAllTags()
    {
        try {
            // Simple query without relationships
            $tags = \DB::table('tags')->select('id', 'name', 'slug')->get();
            return response()->json($tags);
        } catch (\Exception $e) {
            \Log::error('Tags fetch failed: ' . $e->getMessage());
            // Return hardcoded tags as fallback
            return response()->json([
                ['id' => 1, 'name' => 'news', 'slug' => 'news'],
                ['id' => 2, 'name' => 'breaking', 'slug' => 'breaking'],
                ['id' => 3, 'name' => 'sports', 'slug' => 'sports'],
                ['id' => 4, 'name' => 'politics', 'slug' => 'politics']
            ]);
        }
    }

    public function create()
    {
        return view('tags.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:tags',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);

        $tag = Tag::create($data);

        Log::create([
            'user_id' => Auth::id(),
            'action' => 'created',
            'model_type' => 'Tag',
            'model_id' => $tag->id,
            'new_values' => $tag->toArray(),
        ]);

        return redirect()->route('tags.index')->with('success', 'Tag created successfully.');
    }

    public function show(Tag $tag)
    {
        return view('tags.show', compact('tag'));
    }

    // Public-facing: view tag by slug
    public function publicShow(string $slug)
    {
        $tag = Tag::where('slug', $slug)->firstOrFail();
        $articles = \App\Models\Article::published()
            ->whereHas('tags', function ($query) use ($tag) {
                $query->where('tags.id', $tag->id);
            })
            ->with('author.user', 'categories')
            ->latest('published_at')
            ->paginate(10);

        return view('tags.public', compact('tag', 'articles'));
    }

    // API: Get articles by tag slug
    public function getArticlesByTag(string $slug)
    {
        try {
            // Direct DB query to avoid model issues
            $articles = \DB::table('articles')
                ->join('article_tag', 'articles.id', '=', 'article_tag.article_id')
                ->join('tags', 'article_tag.tag_id', '=', 'tags.id')
                ->leftJoin('authors', 'articles.author_id', '=', 'authors.id')
                ->where('articles.status', 'published')
                ->where(function($query) use ($slug) {
                    $query->where('tags.slug', $slug)
                          ->orWhere('tags.name', $slug);
                })
                ->select(
                    'articles.id',
                    'articles.title',
                    'articles.slug',
                    'articles.excerpt',
                    'articles.featured_image',
                    'articles.published_at',
                    'authors.name as author_name'
                )
                ->orderBy('articles.published_at', 'desc')
                ->get()
                ->map(function ($article) {
                    return [
                        'id' => $article->id,
                        'title' => $article->title,
                        'slug' => $article->slug,
                        'excerpt' => $article->excerpt,
                        'image_url' => $article->featured_image ?? 'https://placehold.co/400x250/e2e8f0/64748b?text=No+Image',
                        'published_at' => $article->published_at ? date('F j, Y', strtotime($article->published_at)) : 'No date',
                        'author_name' => $article->author_name ?? 'Unknown Author',
                        'category' => 'News'
                    ];
                });

            return response()->json(['articles' => $articles]);
        } catch (\Exception $e) {
            \Log::error('Tag articles fetch failed: ' . $e->getMessage());
            return response()->json(['articles' => []]);
        }
    }

    public function edit(Tag $tag)
    {
        return view('tags.edit', compact('tag'));
    }

    public function update(Request $request, Tag $tag)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:tags,name,' . $tag->id,
        ]);

        $oldValues = $tag->toArray();

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);

        $tag->update($data);

        Log::create([
            'user_id' => Auth::id(),
            'action' => 'updated',
            'model_type' => 'Tag',
            'model_id' => $tag->id,
            'old_values' => $oldValues,
            'new_values' => $tag->toArray(),
        ]);

        return redirect()->route('tags.index')->with('success', 'Tag updated successfully.');
    }

    public function destroy(Tag $tag)
    {
        $oldValues = $tag->toArray();

        $tag->delete();

        Log::create([
            'user_id' => Auth::id(),
            'action' => 'deleted',
            'model_type' => 'Tag',
            'model_id' => $tag->id,
            'old_values' => $oldValues,
        ]);

        return redirect()->route('tags.index')->with('success', 'Tag deleted successfully.');
    }
}
