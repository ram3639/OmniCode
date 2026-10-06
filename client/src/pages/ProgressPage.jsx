import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Trophy, Target, Activity, Flame, Terminal, Clock, Check } from 'lucide-react';

export default function ProgressPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('Current');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress/me');
        setStats(res.data.progress);
      } catch (err) {
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <div style={{ height: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading analytics...</div>;
  if (error) return <div style={{ height: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>{error}</div>;
  if (!stats) return null;

  const totalSolved = stats.totalSolved || 0;
  const totalSubmissions = stats.totalAttempted || 0;
  const accuracy = totalSubmissions > 0 
    ? Math.round((totalSolved / totalSubmissions) * 100) 
    : 0;

  const totalXp = totalSolved * 50;
  const currentLevel = Math.floor(totalXp / 100) + 1;
  const nextLevelXp = currentLevel * 100;
  const xpProgress = (totalXp % 100);

  // --- LeetCode Heatmap Data Processing ---
  const activityMap = {};
  const availableYears = new Set();
  if (stats.recentSubmissions) {
    stats.recentSubmissions.forEach(sub => {
      if (!sub.submittedAt) return;
      try {
        const dStr = new Date(sub.submittedAt).toISOString().split('T')[0];
        activityMap[dStr] = (activityMap[dStr] || 0) + 1;
        availableYears.add(new Date(sub.submittedAt).getFullYear());
      } catch (e) {}
    });
  }
  
  const yearOptions = ['Current', ...Array.from(availableYears).sort((a,b) => b-a)];
  if (yearOptions.length === 1) yearOptions.push(new Date().getFullYear());

  const monthsData = [];
  for (let i = 0; i < 12; i++) {
    let targetYear, targetMonth;
    if (selectedYear === 'Current') {
        const today = new Date();
        targetYear = today.getFullYear();
        targetMonth = today.getMonth() - (11 - i);
    } else {
        targetYear = Number(selectedYear);
        targetMonth = i;
    }
    
    const d = new Date(targetYear, targetMonth, 1);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const year = d.getFullYear();
    const monthIndex = d.getMonth();

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
    
    const fullDays = [];
    for (let p = 0; p < firstDayOfWeek; p++) fullDays.push(null);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, monthIndex, day);
        if (currentDate > new Date()) {
            fullDays.push(null);
        } else {
            fullDays.push(currentDate);
        }
    }
    
    while (fullDays.length % 7 !== 0) fullDays.push(null);
    
    const weeks = [];
    for (let w = 0; w < fullDays.length; w += 7) {
        weeks.push(fullDays.slice(w, w + 7));
    }
    
    monthsData.push({ name: monthName, year, weeks });
  }

  let activeDaysInView = 0;
  let submissionsInView = 0;
  let maxStreakInView = 0;
  let currentStreak = 0;
  
  const allValidDays = [];
  monthsData.forEach(m => m.weeks.forEach(w => w.forEach(d => { if (d) allValidDays.push(d) })));
  
  allValidDays.forEach(d => {
     const dateStr = d.toISOString().split('T')[0];
     if (activityMap[dateStr]) {
         submissionsInView += activityMap[dateStr];
         activeDaysInView++;
         currentStreak++;
         maxStreakInView = Math.max(maxStreakInView, currentStreak);
     } else {
         currentStreak = 0;
     }
  });
  // ----------------------------------------

  return (
    <div style={{ height: 'calc(100vh - 64px)', overflow: 'hidden', padding: '24px 32px', display: 'flex', gap: '24px', backgroundColor: 'transparent' }}>
      
      {/* Left Column (Profile & Precision) */}
      <div style={{ width: '340px', display: 'flex', flexDirection: 'column', gap: '24px', flexShrink: 0 }}>
        
        {/* Level / Rank Card */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent) 0%, #121115 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 0 30px rgba(196,149,106,0.15)' }}>
            <Trophy size={48} color="#000" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Level {currentLevel}</h2>
          
          <div style={{ width: '100%', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
              <span>{totalXp || 0} XP</span>
              <span>{nextLevelXp} XP</span>
            </div>
            <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${xpProgress}%`, backgroundColor: 'var(--accent)', borderRadius: '3px', transition: 'width 1s ease' }} />
            </div>
          </div>
        </div>

        {/* Accuracy Card */}
        <div style={{ height: '240px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            <Target size={16} /> Precision Rating
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
             <div style={{ fontSize: '56px', fontWeight: 800, color: 'var(--accent)', lineHeight: 1, letterSpacing: '-2px' }}>{accuracy}%</div>
             <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>Global Accuracy</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-primary)', paddingTop: '16px', fontWeight: 500 }}>
            <span><strong style={{color: 'var(--text-primary)'}}>{totalSolved}</strong> Solved</span>
            <span><strong style={{color: 'var(--text-primary)'}}>{totalSubmissions || 0}</strong> Attempted</span>
          </div>
        </div>
      </div>

      {/* Right Column (Metrics & Heatmap) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
        
        {/* Top Metrics Row */}
        <div style={{ display: 'flex', gap: '24px', height: '120px', flexShrink: 0 }}>
          
          {/* Streak */}
          <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(239, 68, 68, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <Flame size={32} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-1px' }}>{stats.currentStreak || 0}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Day Streak</div>
            </div>
          </div>

          {/* Submissions */}
          <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(59, 130, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <Terminal size={32} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-1px' }}>{totalSubmissions || 0}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Code Executions</div>
            </div>
          </div>

        </div>

        {/* Activity Heatmap Area (LeetCode Style) */}
        <div style={{ flexShrink: 0, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
          
          {/* LeetCode Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '16px' }}>{submissionsInView}</span> submissions in {selectedYear === 'Current' ? 'the past one year' : selectedYear}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Total active days: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{activeDaysInView}</span></span>
              <span>Max streak: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{maxStreakInView}</span></span>
              
              {/* Year Selector Dropdown */}
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                   backgroundColor: 'var(--bg-primary)',
                   border: '1px solid var(--border-primary)',
                   color: 'var(--text-primary)',
                   padding: '4px 28px 4px 12px',
                   borderRadius: '6px',
                   fontSize: '12px',
                   outline: 'none',
                   cursor: 'pointer',
                   appearance: 'none',
                   backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                   backgroundRepeat: 'no-repeat',
                   backgroundPosition: 'right 8px center'
                }}
              >
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          
          {/* Month Blocks */}
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
            {monthsData.map((month, mIdx) => (
              <div key={mIdx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                {/* Grid */}
                <div style={{ display: 'flex', gap: '3px' }}>
                  {month.weeks.map((week, wIdx) => (
                    <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {week.map((day, dIdx) => {
                        if (!day) return <div key={dIdx} style={{ width: '12px', height: '12px', backgroundColor: 'transparent' }} />;
                        
                        const dateStr = day.toISOString().split('T')[0];
                        const count = activityMap[dateStr] || 0;
                        
                        const isEmpty = count === 0;
                        let bg = isEmpty ? 'rgba(255,255,255,0.06)' : 'var(--accent)';
                        let opacity = isEmpty ? 1 : (count === 1 ? 0.4 : (count === 2 ? 0.7 : 1));
                        
                        // Exact LeetCode Green matching
                        if (!isEmpty) {
                           if (count === 1) bg = '#0e4429';
                           else if (count === 2) bg = '#006d32';
                           else if (count >= 3) bg = '#26a641';
                           if (count >= 5) bg = '#39d353';
                           opacity = 1;
                        }

                        const title = isEmpty ? `No activity on ${day.toLocaleDateString()}` : `${count} submissions on ${day.toLocaleDateString()}`;
                        
                        return (
                          <div key={dIdx} title={title} style={{
                            width: '12px', height: '12px', borderRadius: '2px',
                            backgroundColor: bg, opacity,
                            cursor: 'crosshair', transition: 'all 0.1s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                {/* Month Label */}
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {month.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions Area (Takes up the rest of the space) */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, flexShrink: 0 }}>
            <Clock size={16} /> Recent Submissions
          </h3>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
            {stats.recentSubmissions?.slice(0, 10).map((ch, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={18} /></div>
                     <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{ch.challengeId || 'Challenge Completed'}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500 }}>
                    {new Date(ch.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
               </div>
            ))}
            {(!stats.recentSubmissions || stats.recentSubmissions.length === 0) && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px 0', fontSize: '13px' }}>
                No recent submissions found. Start coding!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
