<?php

namespace App\Console\Commands;

use App\Models\KnowledgeArticle;
use App\Models\Ticket;
use Database\Seeders\HelpdeskSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DemoReset extends Command
{
    protected $signature = 'demo:reset {--force : Run without confirmation}';

    protected $description = 'Reset the synthetic helpdesk demo data';

    public function handle(): int
    {
        if (! $this->option('force') && ! $this->confirm('This deletes all demo tickets and knowledge articles. Continue?')) {
            return self::FAILURE;
        }

        DB::transaction(function () {
            Ticket::query()->delete();
            KnowledgeArticle::query()->delete();
            $this->call('db:seed', ['--class' => HelpdeskSeeder::class, '--force' => true]);
        });

        $this->info('Demo reset: synthetic tickets and knowledge articles restored.');

        return self::SUCCESS;
    }
}
