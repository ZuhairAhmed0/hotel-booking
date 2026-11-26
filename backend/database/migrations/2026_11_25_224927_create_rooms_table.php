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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id') ->constrained() ->cascadeOnDelete();
            $table->string('room_type');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('capacity')->default(2);
            $table->integer('quantity')->default(1);
            $table->string('image')->nullable();
            $table->boolean('is_available')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
