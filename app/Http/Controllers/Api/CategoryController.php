<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'title' => 'required|string',
        ]);

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'string',
            'title' => 'string',
        ]);

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        // Check if category has products
        if ($category->products()->count() > 0) {
            return response()->json(['message' => 'Cannot delete category with active products.'], 422);
        }

        $category->delete();
        return response()->json(['message' => 'Category deleted.']);
    }
}
