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
        Schema::create('configurations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->boolean('pengumuman_on')->default(false);
            $table->boolean('isi_jadwal_on')->default(false);
            $table->boolean('puzzles_on')->default(false);
            $table->foreignId('current_stage_id')->nullable()->constrained('stages')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configurations');
    }
};
