<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchLog extends Model
{
    protected $fillable = [
        'user_id',
        'query',
        'results_count',
        'ip_address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
