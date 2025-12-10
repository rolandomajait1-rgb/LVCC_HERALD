<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\BrevoMailer;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    protected $brevoMailer;

    public function __construct()
    {
        try {
            $this->brevoMailer = new BrevoMailer();
        } catch (\Exception $e) {
            Log::error('Failed to initialize BrevoMailer: ' . $e->getMessage());
            $this->brevoMailer = null;
        }
    }

    public function sendFeedback(Request $request)
    {
        try {
            $validated = $request->validate([
                'feedback' => 'required|string|max:5000',
                'email' => 'required|email|max:255'
            ]);

            $email = filter_var($validated['email'], FILTER_SANITIZE_EMAIL);
            $feedback = htmlspecialchars($validated['feedback'], ENT_QUOTES, 'UTF-8');

            $adminEmail = env('MAIL_TO_ADDRESS', 'rolandomajait1@gmail.com');
            $subject = 'New Feedback - La Verdad Herald';
            $htmlContent = "<h3>New Feedback Received</h3><p><strong>From:</strong> " . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "</p><p><strong>Feedback:</strong><br>" . nl2br($feedback) . "</p>";

            if ($this->brevoMailer) {
                $this->brevoMailer->sendEmail($adminEmail, $subject, $htmlContent);
            } else {
                throw new \Exception('Email service unavailable');
            }

            return response()->json(['message' => 'Feedback received successfully']);
        } catch (\Exception $e) {
            Log::error('Feedback send failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send feedback'], 500);
        }
    }

    public function requestCoverage(Request $request)
    {
        try {
            $validated = $request->validate([
                'eventName' => 'required|string|max:255',
                'date' => 'required|date',
                'description' => 'required|string|max:5000',
                'contactEmail' => 'required|email|max:255',
                'location' => 'nullable|string|max:500',
                'highlights' => 'nullable|string|max:1000',
                'requestorName' => 'nullable|string|max:255',
                'designation' => 'nullable|string|max:255',
            ]);

            $adminEmail = env('MAIL_TO_ADDRESS', 'rolandomajait1@gmail.com');
            $subject = 'Coverage Request - La Verdad Herald';
            $htmlContent = "<h3>New Coverage Request</h3>
                            <p><strong>Event:</strong> " . htmlspecialchars($validated['eventName'], ENT_QUOTES, 'UTF-8') . "</p>
                            <p><strong>Date:</strong> " . htmlspecialchars($validated['date'], ENT_QUOTES, 'UTF-8') . "</p>
                            <p><strong>Contact:</strong> " . htmlspecialchars($validated['contactEmail'], ENT_QUOTES, 'UTF-8') . "</p>
                            <p><strong>Description:</strong><br>" . nl2br(htmlspecialchars($validated['description'], ENT_QUOTES, 'UTF-8')) . "</p>
                            <p><strong>Location:</strong> " . htmlspecialchars($validated['location'] ?? 'N/A', ENT_QUOTES, 'UTF-8') . "</p>
                            <p><strong>Highlights:</strong> " . htmlspecialchars($validated['highlights'] ?? 'N/A', ENT_QUOTES, 'UTF-8') . "</p>
                            <p><strong>Requestor Name:</strong> " . htmlspecialchars($validated['requestorName'] ?? 'N/A', ENT_QUOTES, 'UTF-8') . "</p>
                            <p><strong>Designation:</strong> " . htmlspecialchars($validated['designation'] ?? 'N/A', ENT_QUOTES, 'UTF-8') . "</p>";

            $this->brevoMailer->sendEmail($adminEmail, $subject, $htmlContent);

            return response()->json(['message' => 'Coverage request received successfully']);
        } catch (\Exception $e) {
            Log::error('Coverage request failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send coverage request'], 500);
        }
    }

    public function joinHerald(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'course' => 'required|string|max:255',
                'gender' => 'required|string|max:50',
                'pubName' => 'required|string|max:255',
                'specificPosition' => 'required|string|max:255',
                'otherClassification' => 'nullable|string|max:255',
                'otherPubOption' => 'nullable|string|max:255',
                'otherDesignation' => 'nullable|string|max:255',
                'classifications' => 'nullable|array',
                'pubOption' => 'nullable|array',
                'designations' => 'nullable|array',
            ]);

            $classifications = htmlspecialchars(json_encode($validated['classifications'] ?? []), ENT_QUOTES, 'UTF-8');
            $pubOption = htmlspecialchars(json_encode($validated['pubOption'] ?? []), ENT_QUOTES, 'UTF-8');
            $designations = htmlspecialchars(json_encode($validated['designations'] ?? []), ENT_QUOTES, 'UTF-8');

            $adminEmail = env('MAIL_TO_ADDRESS', 'rolandomajait1@gmail.com');
            $subject = 'Membership Application - La Verdad Herald';
            $htmlContent = "<h3>New Membership Application</h3>";
            $htmlContent .= "<h4>Personal Information:</h4>";
            $htmlContent .= "<p><strong>Name:</strong> " . htmlspecialchars($validated['name'], ENT_QUOTES, 'UTF-8') . "</p>";
            $htmlContent .= "<p><strong>Course & Year:</strong> " . htmlspecialchars($validated['course'], ENT_QUOTES, 'UTF-8') . "</p>";
            $htmlContent .= "<p><strong>Gender:</strong> " . htmlspecialchars($validated['gender'], ENT_QUOTES, 'UTF-8') . "</p>";
            $htmlContent .= "<h4>Publication Information:</h4>";
            $htmlContent .= "<p><strong>Publication Name:</strong> " . htmlspecialchars($validated['pubName'], ENT_QUOTES, 'UTF-8') . "</p>";
            $htmlContent .= "<p><strong>Classifications:</strong> {$classifications}</p>";
            if (!empty($validated['otherClassification'])) {
                $htmlContent .= "<p><strong>Other Classification:</strong> " . htmlspecialchars($validated['otherClassification'], ENT_QUOTES, 'UTF-8') . "</p>";
            }
            $htmlContent .= "<p><strong>Publishing Option:</strong> {$pubOption}</p>";
            if (!empty($validated['otherPubOption'])) {
                $htmlContent .= "<p><strong>Other Publishing Option:</strong> " . htmlspecialchars($validated['otherPubOption'], ENT_QUOTES, 'UTF-8') . "</p>";
            }
            $htmlContent .= "<p><strong>Designations:</strong> {$designations}</p>";
            if (!empty($validated['otherDesignation'])) {
                $htmlContent .= "<p><strong>Other Designation:</strong> " . htmlspecialchars($validated['otherDesignation'], ENT_QUOTES, 'UTF-8') . "</p>";
            }
            $htmlContent .= "<p><strong>Specific Position:</strong> " . htmlspecialchars($validated['specificPosition'], ENT_QUOTES, 'UTF-8') . "</p>";

            $this->brevoMailer->sendEmail($adminEmail, $subject, $htmlContent);

            return response()->json(['message' => 'Application submitted successfully']);
        } catch (\Exception $e) {
            Log::error('Join Herald failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to submit application'], 500);
        }
    }

    public function subscribe(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|max:255'
            ]);

            $email = filter_var($validated['email'], FILTER_SANITIZE_EMAIL);

            $adminEmail = env('MAIL_TO_ADDRESS', 'rolandomajait1@gmail.com');
            $subject = 'Newsletter Subscription - La Verdad Herald';
            $htmlContent = "<h3>New Newsletter Subscription</h3><p><strong>Email:</strong> " . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "</p>";

            $this->brevoMailer->sendEmail($adminEmail, $subject, $htmlContent);

            return response()->json(['message' => 'Subscription successful']);
        } catch (\Exception $e) {
            Log::error('Subscription failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to subscribe'], 500);
        }
    }
}
