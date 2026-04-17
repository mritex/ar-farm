<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('products'); // Drop old products table to let Laravel manage it
        
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('weight')->nullable();
            $table->string('price');
            $table->string('status')->nullable();
            $table->text('img')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
