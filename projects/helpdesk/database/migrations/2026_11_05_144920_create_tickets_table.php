<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->string('requester_name');
            $table->string('requester_email');
            $table->string('channel')->default('email');
            $table->string('status')->default('open');
            $table->string('priority')->default('normal');
            $table->string('category')->nullable();
            $table->text('summary')->nullable();
            $table->text('suggested_reply')->nullable();
            $table->json('citations')->nullable();
            $table->string('triage_status')->default('pending');
            $table->text('triage_error')->nullable();
            $table->string('ai_model')->nullable();
            $table->timestamp('triaged_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'priority']);
            $table->index('triage_status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
