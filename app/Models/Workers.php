<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workers extends Model

{
    use HasFactory;

    protected $fillable = ['id_user', 'fio', 'tab_nom', 'worker_position', 'fire_instr_last', 'fire_instr_next',
        'electrobez_last', 'electrobez_next', 'laptop_last', 'laptop_next'];


}
