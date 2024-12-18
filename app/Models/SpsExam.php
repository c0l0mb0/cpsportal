<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpsExam extends Model

{
    use HasFactory;

    protected $table = 'sps_exam';

    protected $fillable = ['question', 'answer_1', 'answer_2', 'answer_3', 'answer_4', 'answer_5', 'is_medicine',
        'correct_answer', 'note'];
}
