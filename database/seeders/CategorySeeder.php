<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function up(): void
    {
        Category::create(['name' => 'Vegetable', 'title' => 'Fresh Vegetables']);
        Category::create(['name' => 'Herb', 'title' => 'Aromatic Herbs']);
        Category::create(['name' => 'Fruit', 'title' => 'Seasonal Fruits']);
        Category::create(['name' => 'Fish', 'title' => 'Fresh Fish']);
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->up();
    }
}
