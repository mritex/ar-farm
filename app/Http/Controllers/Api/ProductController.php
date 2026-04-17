<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('category')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'weight' => 'nullable|string',
            'price' => 'required|string',
            'status' => 'nullable|string',
            'img' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $product = Product::create($validated);
        return response()->json($product->load('category'), 201);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'string',
            'weight' => 'nullable|string',
            'price' => 'string',
            'status' => 'nullable|string',
            'img' => 'nullable|string',
            'category_id' => 'exists:categories,id',
        ]);

        $product->update($validated);
        return response()->json($product->load('category'));
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted.']);
    }
}
