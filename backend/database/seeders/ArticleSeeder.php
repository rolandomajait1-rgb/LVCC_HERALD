<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        if (!$admin) {
            $admin = User::where('email', 'admin@laverdad.edu.ph')->first();
        }

        $author = Author::firstOrCreate(
            ['name' => 'La Verdad Herald Staff'],
            ['user_id' => $admin->id ?? 1]
        );

        $categories = Category::all();
        
        $articles = [
            [
                'title' => 'LVCC Celebrates Foundation Day with Grand Festivities',
                'content' => '<p>La Verdad Christian College celebrated its annual Foundation Day with a series of events showcasing student talents, academic achievements, and community spirit. The celebration brought together students, faculty, alumni, and the local community in a day filled with performances, competitions, and inspiring speeches.</p><p>The event highlighted the college\'s commitment to excellence in education and its role in shaping future leaders. Various departments showcased their programs through interactive booths and presentations.</p>',
                'category' => 'News',
            ],
            [
                'title' => 'Student Council Launches Community Outreach Program',
                'content' => '<p>The LVCC Student Council has initiated a new community outreach program aimed at supporting local communities through educational assistance and livelihood projects. The program reflects the college\'s mission of service and social responsibility.</p><p>Students and faculty members have volunteered their time and resources to make a positive impact in surrounding communities, embodying the values of compassion and service that LVCC stands for.</p>',
                'category' => 'News',
            ],
            [
                'title' => 'Reflections on Campus Life: A Student\'s Journey',
                'content' => '<p>College life is a tapestry of experiences, woven with threads of learning, friendship, and self-discovery. As I walk through the familiar corridors of LVCC, I am reminded of the countless moments that have shaped who I am today.</p><p>From late-night study sessions to heartfelt conversations with friends, every experience has contributed to my growth. This journey has taught me resilience, empathy, and the importance of pursuing one\'s passions with dedication.</p>',
                'category' => 'Literary',
            ],
            [
                'title' => 'The Power of Words: Poetry in Modern Times',
                'content' => '<p>In an age dominated by digital communication, poetry remains a powerful medium for expressing the deepest human emotions. The written word has the ability to transcend time and space, connecting hearts across generations.</p><p>Student poets at LVCC continue to explore themes of love, identity, and social justice through their creative works, proving that poetry is far from obsolete in our modern world.</p>',
                'category' => 'Literary',
            ],
            [
                'title' => 'LVCC Basketball Team Wins Regional Championship',
                'content' => '<p>The LVCC Varsity Basketball Team has brought home the championship trophy after a thrilling final game against rival schools. The team\'s dedication, teamwork, and perseverance throughout the season culminated in this well-deserved victory.</p><p>Coach and players expressed their gratitude to the school administration and supporters who cheered them on throughout the tournament. This win marks a significant milestone in LVCC\'s sports history.</p>',
                'category' => 'Sports',
            ],
            [
                'title' => 'Annual Art Exhibition Showcases Student Creativity',
                'content' => '<p>The LVCC Art Department held its annual exhibition featuring works from talented student artists. The exhibition displayed a diverse range of mediums including paintings, sculptures, digital art, and mixed media installations.</p><p>Visitors were impressed by the creativity and technical skill demonstrated by the students. The event provided a platform for emerging artists to showcase their talents and gain recognition for their work.</p>',
                'category' => 'Art',
            ],
            [
                'title' => 'The Importance of Mental Health Awareness on Campus',
                'content' => '<p>Mental health is a crucial aspect of student well-being that deserves more attention and resources. As academic pressures mount and social challenges arise, it is essential that educational institutions prioritize mental health support services.</p><p>LVCC has taken steps to address this need by establishing counseling services and organizing awareness campaigns. However, more work needs to be done to destigmatize mental health issues and create a supportive campus environment.</p>',
                'category' => 'Opinion',
            ],
            [
                'title' => 'Profile: Meet the Dean of Student Affairs',
                'content' => '<p>In this exclusive interview, we sit down with the Dean of Student Affairs to discuss the challenges and rewards of supporting student development. With years of experience in education, the Dean shares insights on creating a positive campus culture.</p><p>From organizing student activities to addressing concerns, the Dean\'s office plays a vital role in ensuring that students have a fulfilling college experience. Learn more about the person behind the position and their vision for LVCC.</p>',
                'category' => 'Features',
            ],
            [
                'title' => 'LVCC Hosts Special Lecture Series on Leadership',
                'content' => '<p>La Verdad Christian College is proud to announce a special lecture series featuring renowned speakers on the topic of leadership and personal development. The series aims to inspire students to become effective leaders in their chosen fields.</p><p>Distinguished guests from various industries will share their experiences and insights, providing valuable lessons on leadership, ethics, and success. Students are encouraged to attend and engage with the speakers.</p>',
                'category' => 'Specials',
            ],
        ];

        foreach ($articles as $articleData) {
            $category = $categories->where('name', $articleData['category'])->first();
            
            $article = Article::create([
                'title' => $articleData['title'],
                'slug' => Str::slug($articleData['title']),
                'content' => $articleData['content'],
                'excerpt' => Str::limit(strip_tags($articleData['content']), 150),
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now()->subDays(rand(1, 30)),
                'featured_image' => null,
            ]);

            if ($category) {
                $article->categories()->attach($category->id);
            }
        }
    }
}
