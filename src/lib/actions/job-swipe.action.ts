"use server"

import { getFirestore } from "firebase-admin/firestore";
import { JobSwipe } from "@/lib/domains/job-swipe.domain";
import admin from "@/lib/firebase/server";
import { convertTimestamps } from "../timestamp";

// Helper function to get Firestore instance
function getDb() {
    return getFirestore();
}

interface JobSwipeResponse {
    success: boolean;
    error?: string;
    swipeId?: string;
}

/**
 * Get user's job swipe preferences from Firestore
 */
export async function getUserSwipes(userId: string): Promise<{ swipe: JobSwipe | null; error?: string }> {
    try {
        const db = getDb();
        const swipesCollection = 'JobSwipes';

        // Reference to the swipe document
        const swipeRef = db.collection(swipesCollection).doc(userId);

        // Get the swipe document
        const swipeSnapshot = await swipeRef.get();

        if (!swipeSnapshot.exists) {
            // Create a new swipe document if it doesn't exist
            const newSwipe: JobSwipe = {
                id: userId,
                user_id: userId,
                like_job_ids: [],
                dislike_job_ids: []
            };

            await swipeRef.set({
                ...newSwipe,
                created_at: admin.firestore.FieldValue.serverTimestamp(),
                updated_at: admin.firestore.FieldValue.serverTimestamp()
            });

            return { swipe: newSwipe };
        }

        // Get the raw data
        const rawData = swipeSnapshot.data();

        // Add the ID to the swipe data
        const swipeWithId = {
            id: userId,
            ...rawData
        };

        // Convert timestamps to serializable format
        const swipeData = convertTimestamps(swipeWithId) as JobSwipe;

        return { swipe: swipeData };
    } catch (error) {
        console.error("Error getting user swipes:", error);
        return {
            swipe: null,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

/**
 * Add a job to user's liked jobs
 */
export async function likeJob(userId: string, jobId: string): Promise<JobSwipeResponse> {
    try {
        const db = getDb();
        const swipesCollection = 'JobSwipes';

        // Reference to the swipe document
        const swipeRef = db.collection(swipesCollection).doc(userId);

        // Get the current swipe data
        const { swipe } = await getUserSwipes(userId);

        if (!swipe) {
            return {
                success: false,
                error: "Could not retrieve or create user swipes"
            };
        }

        // Add job to liked array and remove from disliked if present
        const likedJobs = [...(Object.values(swipe.like_job_ids) || [])];
        const dislikedJobs = [...(Object.values(swipe.dislike_job_ids) || [])].filter(id => id !== jobId);

        // Only add if it's not already in the array
        if (!likedJobs.includes(jobId)) {
            likedJobs.push(jobId);
        }

        // Update the document
        await swipeRef.update({
            like_job_ids: likedJobs,
            dislike_job_ids: dislikedJobs,
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            success: true,
            swipeId: userId
        };
    } catch (error) {
        console.error("Error liking job:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

/**
 * Add a job to user's disliked jobs
 */
export async function dislikeJob(userId: string, jobId: string): Promise<JobSwipeResponse> {
    try {
        const db = getDb();
        const swipesCollection = 'JobSwipes';

        // Reference to the swipe document
        const swipeRef = db.collection(swipesCollection).doc(userId);

        // Get the current swipe data
        const { swipe } = await getUserSwipes(userId);

        if (!swipe) {
            return {
                success: false,
                error: "Could not retrieve or create user swipes"
            };
        }

        // Add job to disliked array and remove from liked if present
        const likedJobs = [...(Object.values(swipe.like_job_ids) || [])].filter(id => id !== jobId);
        const dislikedJobs = [...(Object.values(swipe.dislike_job_ids) || [])];

        // Only add if it's not already in the array
        if (!dislikedJobs.includes(jobId)) {
            dislikedJobs.push(jobId);
        }

        // Update the document
        await swipeRef.update({
            like_job_ids: likedJobs,
            dislike_job_ids: dislikedJobs,
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            success: true,
            swipeId: userId
        };
    } catch (error) {
        console.error("Error disliking job:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

/**
 * Remove a job from user's liked jobs
 */
export async function unlikeJob(userId: string, jobId: string): Promise<JobSwipeResponse> {
    try {
        const db = getDb();
        const swipesCollection = 'JobSwipes';

        // Reference to the swipe document
        const swipeRef = db.collection(swipesCollection).doc(userId);

        // Get the current swipe data
        const { swipe } = await getUserSwipes(userId);

        if (!swipe) {
            return {
                success: false,
                error: "Could not retrieve or create user swipes"
            };
        }

        // Remove job from liked array
        const likedJobs = [...(swipe.like_job_ids || [])].filter(id => id !== jobId);

        // Update the document
        await swipeRef.update({
            like_job_ids: likedJobs,
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            success: true,
            swipeId: userId
        };
    } catch (error) {
        console.error("Error unliking job:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

/**
 * Remove a job from user's disliked jobs
 */
export async function undislikeJob(userId: string, jobId: string): Promise<JobSwipeResponse> {
    try {
        const db = getDb();
        const swipesCollection = 'JobSwipes';

        // Reference to the swipe document
        const swipeRef = db.collection(swipesCollection).doc(userId);

        // Get the current swipe data
        const { swipe } = await getUserSwipes(userId);

        if (!swipe) {
            return {
                success: false,
                error: "Could not retrieve or create user swipes"
            };
        }

        // Remove job from disliked array
        const dislikedJobs = [...(swipe.dislike_job_ids || [])].filter(id => id !== jobId);

        // Update the document
        await swipeRef.update({
            dislike_job_ids: dislikedJobs,
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            success: true,
            swipeId: userId
        };
    } catch (error) {
        console.error("Error undisliking job:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

/**
 * Check if a user has liked a job
 */
export async function hasUserLikedJob(userId: string, jobId: string): Promise<{ hasLiked: boolean; error?: string }> {
    try {
        const { swipe, error } = await getUserSwipes(userId);

        if (error || !swipe) {
            return {
                hasLiked: false,
                error: error || "Could not retrieve user swipes"
            };
        }

        return {
            hasLiked: swipe.like_job_ids?.includes(jobId) || false
        };
    } catch (error) {
        console.error("Error checking if user liked job:", error);
        return {
            hasLiked: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

/**
 * Check if a user has disliked a job
 */
export async function hasUserDislikedJob(userId: string, jobId: string): Promise<{ hasDisliked: boolean; error?: string }> {
    try {
        const { swipe, error } = await getUserSwipes(userId);

        if (error || !swipe) {
            return {
                hasDisliked: false,
                error: error || "Could not retrieve user swipes"
            };
        }

        return {
            hasDisliked: swipe.dislike_job_ids?.includes(jobId) || false
        };
    } catch (error) {
        console.error("Error checking if user disliked job:", error);
        return {
            hasDisliked: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

/**
 * Get all liked jobs for a user
 */
export async function getLikedJobs(userId: string): Promise<{ jobIds: string[]; error?: string }> {
    try {
        const { swipe, error } = await getUserSwipes(userId);

        if (error || !swipe) {
            return {
                jobIds: [],
                error: error || "Could not retrieve user swipes"
            };
        }

        return {
            jobIds: swipe.like_job_ids || []
        };
    } catch (error) {
        console.error("Error getting liked jobs:", error);
        return {
            jobIds: [],
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

/**
 * Get all disliked jobs for a user
 */
export async function getDislikedJobs(userId: string): Promise<{ jobIds: string[]; error?: string }> {
    try {
        const { swipe, error } = await getUserSwipes(userId);

        if (error || !swipe) {
            return {
                jobIds: [],
                error: error || "Could not retrieve user swipes"
            };
        }

        return {
            jobIds: swipe.dislike_job_ids || []
        };
    } catch (error) {
        console.error("Error getting disliked jobs:", error);
        return {
            jobIds: [],
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}
