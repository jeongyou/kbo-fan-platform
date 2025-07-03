'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket, Download, Share2, MapPin, Tv } from 'lucide-react';
import { useState, useEffect } from 'react';
import TicketGenerator from './ticket-generator';

interface Team {
  id: string;
  name: string;
  color: string;
  logo: string;
}

interface TicketCollectionProps {
  team: Team;
}

interface FanTicket {
  id: number;
  type: 'attendance' | 'tv';
  team: string;
  date: string;
  gameId?: string;
  opponent?: string;
  stadium?: string;
  createdAt: string;
}

const TEAM_DESIGNS = {
  doosan: {
    primary: '#131230',
    secondary: '#1a1a3a',
    accent: '#ffd700',
    pattern: 'navy-stripes',
    nickname: 'Bears',
  },
  lg: {
    primary: '#C30452',
    secondary: '#e91e63',
    accent: '#ffffff',
    pattern: 'twins-diamond',
    nickname: 'Twins',
  },
  kia: {
    primary: '#EA0029',
    secondary: '#ff1744',
    accent: '#000000',
    pattern: 'tiger-stripes',
    nickname: 'Tigers',
  },
  samsung: {
    primary: '#074CA1',
    secondary: '#1976d2',
    accent: '#ffffff',
    pattern: 'lion-mane',
    nickname: 'Lions',
  },
  lotte: {
    primary: '#041E42',
    secondary: '#1565c0',
    accent: '#ffd700',
    pattern: 'giant-waves',
    nickname: 'Giants',
  },
  ssg: {
    primary: '#CE0E2D',
    secondary: '#d32f2f',
    accent: '#ffffff',
    pattern: 'landers-grid',
    nickname: 'Landers',
  },
  hanwha: {
    primary: '#FF6600',
    secondary: '#ff9800',
    accent: '#000000',
    pattern: 'eagle-wings',
    nickname: 'Eagles',
  },
  kiwoom: {
    primary: '#570514',
    secondary: '#8d1e2d',
    accent: '#ffd700',
    pattern: 'hero-shield',
    nickname: 'Heroes',
  },
  nc: {
    primary: '#315288',
    secondary: '#5472d3',
    accent: '#ffffff',
    pattern: 'dino-scales',
    nickname: 'Dinos',
  },
  kt: {
    primary: '#000000',
    secondary: '#424242',
    accent: '#ffd700',
    pattern: 'wiz-magic',
    nickname: 'Wiz',
  },
};

export default function TicketCollection({ team }: TicketCollectionProps) {
  const [tickets, setTickets] = useState<FanTicket[]>([]);

  useEffect(() => {
    const savedTickets = JSON.parse(localStorage.getItem('fanTickets') || '[]');
    setTickets(
      savedTickets.filter((ticket: FanTicket) => ticket.team === team.id)
    );
  }, [team.id]);

  const getTicketIcon = (type: string) => {
    return type === 'attendance' ? (
      <MapPin className='w-4 h-4' />
    ) : (
      <Tv className='w-4 h-4' />
    );
  };

  const getTicketTitle = (type: string) => {
    return type === 'attendance' ? '직관 티켓' : 'TV 시청 티켓';
  };

  const getTeamDesign = (teamId: string) => {
    return (
      TEAM_DESIGNS[teamId as keyof typeof TEAM_DESIGNS] || TEAM_DESIGNS.doosan
    );
  };

  const getPatternStyle = (
    pattern: string,
    primary: string,
    secondary: string
  ) => {
    switch (pattern) {
      case 'navy-stripes':
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${primary}, ${primary} 10px, ${secondary} 10px, ${secondary} 20px)`,
        };
      case 'twins-diamond':
        return {
          backgroundImage: `repeating-conic-gradient(from 45deg, ${primary} 0deg 90deg, ${secondary} 90deg 180deg)`,
        };
      case 'tiger-stripes':
        return {
          backgroundImage: `repeating-linear-gradient(90deg, ${primary}, ${primary} 8px, ${secondary} 8px, ${secondary} 16px)`,
        };
      case 'lion-mane':
        return {
          backgroundImage: `radial-gradient(circle at center, ${primary} 30%, ${secondary} 70%)`,
        };
      case 'giant-waves':
        return {
          backgroundImage: `repeating-linear-gradient(135deg, ${primary} 0px, ${secondary} 15px, ${primary} 30px)`,
        };
      case 'landers-grid':
        return {
          backgroundImage: `repeating-linear-gradient(0deg, ${primary}, ${primary} 5px, ${secondary} 5px, ${secondary} 10px),
                           repeating-linear-gradient(90deg, ${primary}, ${primary} 5px, ${secondary} 5px, ${secondary} 10px)`,
        };
      case 'eagle-wings':
        return {
          backgroundImage: `conic-gradient(from 180deg at 50% 50%, ${primary} 0deg, ${secondary} 180deg, ${primary} 360deg)`,
        };
      case 'hero-shield':
        return {
          backgroundImage: `linear-gradient(45deg, ${primary} 25%, ${secondary} 25%, ${secondary} 50%, ${primary} 50%, ${primary} 75%, ${secondary} 75%)`,
        };
      case 'dino-scales':
        return {
          backgroundImage: `repeating-radial-gradient(circle at 0 0, ${primary} 0px, ${secondary} 10px, ${primary} 20px)`,
        };
      case 'wiz-magic':
        return {
          backgroundImage: `conic-gradient(${primary} 0deg, ${secondary} 120deg, ${primary} 240deg, ${secondary} 360deg)`,
        };
      default:
        return {
          background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        };
    }
  };

  const teamDesign = getTeamDesign(team.id);

  return (
    <div className='space-y-4'>
      {/* Ticket Generator Section */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Ticket className='w-5 h-5' />
            티켓 발급
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TicketGenerator team={team} />
        </CardContent>
      </Card>

      {/* Collection Stats - 항상 상단에 위치 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>컬렉션 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {tickets.filter((t) => t.type === 'attendance').length}
              </div>
              <div className='text-sm text-gray-600'>직관 티켓</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {tickets.filter((t) => t.type === 'tv').length}
              </div>
              <div className='text-sm text-gray-600'>TV 시청 티켓</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collection Header */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Ticket className='w-5 h-5' />내 티켓 컬렉션
            </div>
            <Badge variant='secondary'>총 {tickets.length}장</Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {tickets.length === 0 ? (
        <Card>
          <CardContent>
            <div className='text-center py-8'>
              <Ticket className='w-16 h-16 mx-auto mb-4 text-gray-400' />
              <h3 className='text-lg font-semibold mb-2'>아직 티켓이 없어요</h3>
              <p className='text-gray-600 mb-4'>
                경기를 보고 직관 티켓이나 TV 시청 티켓을 발급받아보세요!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Tickets Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {tickets.map((ticket) => (
              <Card key={ticket.id} className='overflow-hidden'>
                <CardContent className='p-0'>
                  {/* Team-specific Ticket Design */}
                  <div
                    className='relative text-white p-6 overflow-hidden'
                    style={getPatternStyle(
                      teamDesign.pattern,
                      teamDesign.primary,
                      teamDesign.secondary
                    )}
                  >
                    {/* Team accent overlay */}
                    <div
                      className='absolute inset-0 opacity-10'
                      style={{ backgroundColor: teamDesign.accent }}
                    />

                    <div className='relative z-10 text-center'>
                      {/* Team Header */}
                      <div className='mb-3'>
                        <div className='text-2xl mb-1'>{team.logo}</div>
                        <div className='font-bold text-lg tracking-wide'>
                          {teamDesign.nickname.toUpperCase()}
                        </div>
                        <div className='text-xs opacity-90'>{team.name}</div>
                      </div>

                      {/* Ticket Type Badge */}
                      <div
                        className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold mb-3'
                        style={{
                          backgroundColor: teamDesign.accent,
                          color: teamDesign.primary,
                        }}
                      >
                        {getTicketIcon(ticket.type)}
                        {ticket.type === 'attendance'
                          ? 'STADIUM'
                          : 'TV VIEWING'}
                      </div>

                      {/* Game Info */}
                      <div className='space-y-2 mb-3'>
                        <div
                          className='bg-white/20 backdrop-blur-sm rounded p-2 border'
                          style={{ borderColor: teamDesign.accent + '40' }}
                        >
                          <div className='text-xs opacity-90'>VENUE</div>
                          <div className='font-bold text-xs'>
                            {ticket.stadium || '잠실야구장'}
                          </div>
                        </div>

                        <div
                          className='bg-white/20 backdrop-blur-sm rounded p-2 border'
                          style={{ borderColor: teamDesign.accent + '40' }}
                        >
                          <div className='text-xs opacity-90'>DATE</div>
                          <div className='font-bold text-xs'>{ticket.date}</div>
                        </div>
                      </div>

                      {/* Serial Number */}
                      <div className='text-xs opacity-75 font-mono'>
                        #{ticket.id.toString().slice(-6)}
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className='absolute top-3 right-3 opacity-20'>
                      <div className='text-2xl'>{team.logo}</div>
                    </div>
                    <div className='absolute bottom-3 left-3 opacity-20'>
                      <div className='text-lg'>{team.logo}</div>
                    </div>

                    {/* Ticket perforation effect */}
                    <div className='absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2'>
                      <div className='w-4 h-4 bg-white rounded-full'></div>
                    </div>
                    <div className='absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2'>
                      <div className='w-4 h-4 bg-white rounded-full'></div>
                    </div>
                  </div>

                  {/* Ticket Actions */}
                  <div className='p-4'>
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1 bg-transparent'
                      >
                        <Download className='w-3 h-3 mr-1' />
                        다운로드
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1 bg-transparent'
                      >
                        <Share2 className='w-3 h-3 mr-1' />
                        공유
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
