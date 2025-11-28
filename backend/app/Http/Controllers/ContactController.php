<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\BrevoMailer;

class ContactController extends Controller
{
    protected $brevoMailer;

    public function __construct(BrevoMailer $brevoMailer)
    {
        $this->brevoMailer = $brevoMailer;
    }

    public function sendFeedback(Request $request)
    {
        $request->validate([
            'feedback' => 'required|string',
            'email' => 'required|email'
        ]);

        $adminEmail = env('MAIL_TO_ADDRESS', 'rolandomajait1@gmail.com');
        $subject = 'New Feedback - La Verdad Herald';
        $htmlContent = "<h3>New Feedback Received</h3><p><strong>From:</strong> {$request->email}</p><p><strong>Feedback:</strong><br>{$request->feedback}</p>";

        $this->brevoMailer->sendEmail($adminEmail, $subject, $htmlContent);

        return response()->json(['message' => 'Feedback received successfully']);
    }

    public function requestCoverage(Request $request)
    {
        $request->validate([
            'eventName' => 'required|string',
            'date' => 'required|date',
            'description' => 'required|string',
            'contactEmail' => 'required|string'
        ]);

        $adminEmail = env('MAIL_TO_ADDRESS', 'rolandomajait1@gmail.com');
        $subject = 'Coverage Request - La Verdad Herald';
        $htmlContent = "<h3>New Coverage Request</h3><p><strong>Event:</strong> {$request->eventName}</p><p><strong>Date:</strong> {$request->date}</p><p><strong>Contact:</strong> {$request->contactEmail}</p><p><strong>Description:</strong><br>{$request->description}</p>";

        $this->brevoMailer->sendEmail($adminEmail, $subject, $htmlContent);

        return response()->json(['message' => 'Coverage request received successfully']);
    }

    public function joinHerald(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'course' => 'required|string',
            'gender' => 'required|string',
            'pubName' => 'required|string',
            'specificPosition' => 'required|string'
        ]);

        $classifications = json_encode($request->classifications ?? []);
        $pubOption = json_encode($request->pubOption ?? []);
        $designations = json_encode($request->designations ?? []);

        $adminEmail = env('MAIL_TO_ADDRESS', 'rolandomajait1@gmail.com');
        $subject = 'Membership Application - La Verdad Herald';
        $htmlContent = "<h3>New Membership Application</h3>";
        $htmlContent .= "<h4>Personal Information:</h4>";
        $htmlContent .= "<p><strong>Name:</strong> {$request->name}</p>";
        $htmlContent .= "<p><strong>Course & Year:</strong> {$request->course}</p>";
        $htmlContent .= "<p><strong>Gender:</strong> {$request->gender}</p>";
        $htmlContent .= "<h4>Publication Information:</h4>";
        $htmlContent .= "<p><strong>Publication Name:</strong> {$request->pubName}</p>";
        $htmlContent .= "<p><strong>Classifications:</strong> {$classifications}</p>";
        $htmlContent .= "<p><strong>Publishing Option:</strong> {$pubOption}</p>";
        $htmlContent .= "<p><strong>Designations:</strong> {$designations}</p>";
        $htmlContent .= "<p><strong>Specific Position:</strong> {$request->specificPosition}</p>";

        $this->brevoMailer->sendEmail($adminEmail, $subject, $htmlContent);

        return response()->json(['message' => 'Application submitted successfully']);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $adminEmail = env('MAIL_TO_ADDRESS', 'rolandomajait1@gmail.com');
        $subject = 'Newsletter Subscription - La Verdad Herald';
        $htmlContent = "<h3>New Newsletter Subscription</h3><p><strong>Email:</strong> {$request->email}</p>";

        $this->brevoMailer->sendEmail($adminEmail, $subject, $htmlContent);

        return response()->json(['message' => 'Subscription successful']);
    }
}
