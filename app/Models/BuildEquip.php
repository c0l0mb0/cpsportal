<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuildEquip extends Model
{
    use HasFactory;

    protected $table = 'build_equip';

    protected $fillable = [
         'id_build', 'id_equip', 'quantity', 'cel_january_gray', 'cel_february_gray', 'cel_march_gray',
        'cel_april_gray', 'cel_may_gray', 'cel_june_gray', 'cel_july_gray', 'cel_august_gray', 'cel_september_gray',
        'cel_october_gray', 'cel_november_gray', 'cel_december_gray', 'numb_syst_asps', 'numb_syst_aspt', 'equip_year',
        'measure', 'cel_july', 'cel_november', 'cel_january', 'cel_august', 'cel_february', 'who_change', 'cel_march',
        'cel_september', 'cel_april', 'cel_december', 'cel_may', 'cel_october', 'cel_june', 'who_create',
    ];
}
