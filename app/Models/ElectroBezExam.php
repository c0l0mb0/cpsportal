<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElectroBezExam extends Model
{
    use HasFactory;

    protected $table = 'electro_bez_exam';

    protected $fillable = [
        'question_theme_correct', 'theme', 'question_number', 'till_1000', 'till_above_1000', 'second_group',
        'third_group', 'fourth_group', 'fifth_group', 'commission_member', 'emploee', 'book_link',
        'theme_question_answer'
    ];
}
