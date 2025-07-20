"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import TelegramChat from "@/components/chat/TelegramChat5";
import { User } from '@supabase/supabase-js';
import { FaGoogle, FaSignOutAlt } from 'react-icons/fa';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

function ChatWindow() {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);
            setLoading(false);
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${BASE_URL}/chatwindow`,
            },
        });

        if (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return <div>Loading chat with CemTemBot</div>;
    }

    return (
        <>
            {!user ? (
                // BEFORE SIGN IN LAYOUT: CENTERED GRADIENT BOX (Responsive)
                <div className="flex flex-col items-center justify-center h-screen px-4"> {/* Added horizontal padding for small screens */}
                    <div
                        className="flex flex-col rounded-lg h-auto w-full max-w-sm sm:max-w-md md:h-3/4 md:w-3/4 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900 shadow-2xl p-6 md:p-8 text-center" // Adjusted width, padding, and height for responsiveness
                    >
                        <div className="p-4 md:p-6 rounded-lg bg-black/40 w-full"> {/* Ensured inner box takes full width on mobile */}
                            <h1 className="text-xl sm:text-2xl font-semibold text-white mb-3 md:mb-4">Welcome to the Chat Window</h1> {/* Adjusted font size for mobile */}
                            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Sign In to start Using the CemTemBot</h3> {/* Adjusted font size for mobile */}
                            <div className="flex justify-center">
                                <button
                                    onClick={handleSignInWithGoogle}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center text-base sm:text-lg" // Adjusted font size for mobile
                                >
                                    <FaGoogle className="mr-2" />
                                    Sign In with Google
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // AFTER SIGN IN LAYOUT: SIMPLE BACKGROUND WITH LARGE CHAT WINDOW (Responsive)
                <div className="flex flex-col h-screen bg-cyan-900 text-white p-4"> {/* Added padding to the main container */}
                    {/* Header with Welcome Message and Sign Out Button */}
                    <div className="w-full mx-auto mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center p-2"> {/* Changed to column on mobile, row on sm+ */}
                        <h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-left mb-2 sm:mb-0">Welcome to the Chat Window</h1> {/* Centered on mobile, left on sm+ */}
                        <button
                            onClick={handleSignOut}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center text-sm sm:text-base w-fit mx-auto sm:mx-0" // Centered on mobile, aligned on sm+
                        >
                            <FaSignOutAlt className="mr-2" />
                            Sign Out
                        </button>
                    </div>

                    {/* Chat Window */}
                    <div className="w-full flex-grow rounded-lg shadow-xl overflow-hidden bg-black/60 backdrop-blur-md"> {/* Chat takes full width on mobile */}
                        <TelegramChat user={user} />
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatWindow;