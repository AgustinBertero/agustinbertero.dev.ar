<?php

use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::get('/', [TicketController::class, 'index'])
    ->middleware('throttle:60,1')
    ->name('tickets.index');

Route::post('/tickets', [TicketController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('tickets.store');

Route::get('/tickets/{ticket}', [TicketController::class, 'show'])
    ->middleware('throttle:60,1')
    ->name('tickets.show');

Route::post('/tickets/{ticket}/triage', [TicketController::class, 'triage'])
    ->middleware('throttle:6,1')
    ->name('tickets.triage');
