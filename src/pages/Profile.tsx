import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Star, Trophy, Award, Crown, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  profile_picture_url: string | null;
  preferred_language: string | null;
  billing_address: any;
}

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          return;
        }

        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#181611] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-[#b9b09d]">Caricamento...</p>
        </div>
      </div>
    );
  }

  const userInitials = `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : user.email?.split('@')[0] || 'Utente DR7';

  // Mock data for demo
  const currentLevel = 3;
  const currentPoints = 600;
  const nextLevelPoints = 1000;
  const progressPercent = (currentPoints / nextLevelPoints) * 100;

  const badges = [
    { name: 'Explorer', icon: Star, unlocked: true },
    { name: 'Connoisseur', icon: Trophy, unlocked: true },
    { name: 'Elite', icon: Crown, unlocked: true },
    { name: 'Pioneer', icon: Award, unlocked: false },
    { name: 'Navigator', icon: Target, unlocked: false },
    { name: 'Adventurer', icon: Star, unlocked: false },
  ];

  const rewards = [
    { name: 'Accesso Eventi Esclusivi', image: '/luxury-event.jpg' },
    { name: 'Upgrade Auto di Lusso', image: '/luxury-car.jpg' },
    { name: 'Esperienza Yacht Privato', image: '/yacht.jpg' },
    { name: 'VIP Nightlife Pass', image: '/vip-night.jpg' },
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#181611]" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#393328] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-white/80 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">DR7 Luxury Empire</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <button
                onClick={() => navigate('/home')}
                className="text-white text-sm font-medium leading-normal hover:text-white/80"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/rentals')}
                className="text-white text-sm font-medium leading-normal hover:text-white/80"
              >
                Rent
              </button>
              <button
                onClick={() => navigate('/services')}
                className="text-white text-sm font-medium leading-normal hover:text-white/80"
              >
                Lifestyle
              </button>
              <button className="text-white text-sm font-medium leading-normal hover:text-white/80">
                Membership
              </button>
            </div>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#393328] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <Bell className="w-5 h-5" />
            </button>
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile?.profile_picture_url || ''} />
              <AvatarFallback className="bg-[#393328] text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Profile Section */}
            <div className="flex p-4">
              <div className="flex w-full flex-col gap-4 items-center">
                <div className="flex gap-4 flex-col items-center">
                  <Avatar className="min-h-32 w-32">
                    <AvatarImage src={profile?.profile_picture_url || ''} />
                    <AvatarFallback className="bg-[#393328] text-white text-2xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
                      {displayName}
                    </p>
                    <p className="text-[#b9b09d] text-base font-normal leading-normal text-center">
                      Membro dal 2024
                    </p>
                    <p className="text-[#b9b09d] text-base font-normal leading-normal text-center">
                      Livello {currentLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col gap-3 p-4">
              <div className="flex gap-6 justify-between">
                <p className="text-white text-base font-medium leading-normal">
                  Prossimo Livello: Livello {currentLevel + 1}
                </p>
              </div>
              <div className="rounded bg-[#544b3b]">
                <div className="h-2 rounded bg-white" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="text-[#b9b09d] text-sm font-normal leading-normal">
                {currentPoints} / {nextLevelPoints} punti
              </p>
            </div>

            {/* Badges Section */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Badge
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {badges.map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <div key={badge.name} className="flex flex-col gap-3 text-center pb-3">
                    <div className="px-4">
                      <div className={`w-full aspect-square rounded-full flex items-center justify-center ${
                        badge.unlocked ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-[#393328]'
                      }`}>
                        <IconComponent 
                          className={`w-12 h-12 ${badge.unlocked ? 'text-white' : 'text-[#b9b09d]'}`} 
                        />
                      </div>
                    </div>
                    <p className={`text-base font-medium leading-normal ${
                      badge.unlocked ? 'text-white' : 'text-[#b9b09d]'
                    }`}>
                      {badge.name}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Rewards Section */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Ricompense
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {rewards.map((reward, index) => (
                <div key={reward.name} className="flex flex-col gap-3 pb-3">
                  <div className="w-full aspect-square bg-gradient-to-br from-[#393328] to-[#544b3b] rounded-lg flex items-center justify-center">
                    <Star className="w-12 h-12 text-yellow-400" />
                  </div>
                  <p className="text-white text-base font-medium leading-normal">
                    {reward.name}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 p-4 pt-8">
              <Button
                onClick={() => navigate('/home')}
                className="flex-1 bg-[#393328] hover:bg-[#544b3b] text-white"
              >
                Torna alla Home
              </Button>
              <Button
                onClick={() => navigate('/rentals')}
                className="flex-1 bg-white hover:bg-gray-100 text-black"
              >
                Esplora Servizi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;