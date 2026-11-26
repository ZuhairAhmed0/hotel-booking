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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')
            ->constrained()
            ->cascadeOnDelete();

      $table->string('customer_name');
      $table->string('customer_phone');
      $table->string('customer_email')->nullable();

      $table->date('check_in');
      $table->date('check_out');

      $table->integer('guests')->default(1);

      $table->decimal('total_price', 10, 2);

      $table->enum('status', [
          'pending',
          'confirmed',
          'rejected',
          'cancelled'
      ])->default('pending');

      $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
