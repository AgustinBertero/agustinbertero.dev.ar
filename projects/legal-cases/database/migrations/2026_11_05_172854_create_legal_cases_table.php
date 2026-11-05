<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('legal_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->restrictOnDelete();
            $table->string('title');
            $table->string('case_number')->nullable();
            $table->string('court')->nullable();
            $table->string('jurisdiction')->nullable();
            $table->string('matter')->default('civil');
            $table->string('status')->default('open');
            $table->text('parties')->nullable();
            $table->text('description')->nullable();
            $table->date('started_at')->nullable();
            $table->date('closed_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['client_id', 'status']);
            $table->index('case_number');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legal_cases');
    }
};
