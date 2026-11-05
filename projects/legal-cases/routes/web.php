<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CaseNoteController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeadlineController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\LegalCaseController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/', DashboardController::class)->name('dashboard');

    Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
    Route::post('clients', [ClientController::class, 'store'])->name('clients.store');
    Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show');
    Route::put('clients/{client}', [ClientController::class, 'update'])->name('clients.update');
    Route::delete('clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');

    Route::get('cases', [LegalCaseController::class, 'index'])->name('cases.index');
    Route::post('cases', [LegalCaseController::class, 'store'])->name('cases.store');
    Route::get('cases/{case}', [LegalCaseController::class, 'show'])->name('cases.show');
    Route::put('cases/{case}', [LegalCaseController::class, 'update'])->name('cases.update');
    Route::delete('cases/{case}', [LegalCaseController::class, 'destroy'])->name('cases.destroy');
    Route::post('cases/{case}/notes', [CaseNoteController::class, 'store'])->name('cases.notes.store');
    Route::post('cases/{case}/documents', [DocumentController::class, 'store'])->name('cases.documents.store');

    Route::get('deadlines', [DeadlineController::class, 'index'])->name('deadlines.index');
    Route::post('deadlines', [DeadlineController::class, 'store'])->name('deadlines.store');
    Route::put('deadlines/{deadline}', [DeadlineController::class, 'update'])->name('deadlines.update');
    Route::post('deadlines/{deadline}/complete', [DeadlineController::class, 'complete'])->name('deadlines.complete');
    Route::delete('deadlines/{deadline}', [DeadlineController::class, 'destroy'])->name('deadlines.destroy');

    Route::get('tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::put('tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::post('tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');
    Route::delete('tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');
    Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');

    Route::get('audit', [AuditLogController::class, 'index'])->name('audit.index');
});
