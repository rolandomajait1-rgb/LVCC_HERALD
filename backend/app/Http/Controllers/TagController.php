<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Log as ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
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
            $tags = Tag::select('id', 'name', 'slug')
                ->orderBy('name', 'asc')
                ->get();
            
            return response()->json($tags);
        } catch (\Exception $e) {
            \Log::error('Get all tags error: ' . $e->getMessage());
            return response()->json([], 200);
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

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'created',
            'model_type' => 'Tag',
            'model_id' => $tag->id,
            'new_values' => $tag->toArray(),
        ]);

        return response()->json($tag, 201);
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

    public function getArticlesByTag(string $slug)
    {
        try {
            $tag = Tag::where('slug', $slug)->orWhere('name', $slug)->first();
            
            if (!$tag) {
                return response()->json(['articles' => []]);
            }

            $articles = \App\Models\Article::where('status', 'published')
                ->whereHas('tags', function ($query) use ($tag) {
                    $query->where('tags.id', $tag->id);
                })
                ->with(['author.user', 'categories'])
                ->orderBy('published_at', 'desc')
                ->get()
                ->map(function ($article) {
                    return [
                        'id' => $article->id,
                        'title' => $article->title,
                        'slug' => $article->slug,
                        'excerpt' => $article->excerpt,
                        'image_url' => $article->featured_image ?? 'https://placehold.co/400x250/e2e8f0/64748b?text=No+Image',
                        'published_at' => $article->published_at ? $article->published_at->format('F j, Y') : 'No date',
                        'author_name' => $article->author?->user?->name ?? $article->author?->name ?? 'Unknown Author',
                        'category' => $article->categories->first()?->name ?? 'News'
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

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'updated',
            'model_type' => 'Tag',
            'model_id' => $tag->id,
            'old_values' => $oldValues,
            'new_values' => $tag->toArray(),
        ]);

        return response()->json($tag);
    }

    public function destroy(Tag $tag)
    {
        $oldValues = $tag->toArray();

        $tag->delete();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'deleted',
            'model_type' => 'Tag',
            'model_id' => $tag->id,
            'old_values' => $oldValues,
        ]);

        return response()->json(['message' => 'Tag deleted successfully']);
    }
}
