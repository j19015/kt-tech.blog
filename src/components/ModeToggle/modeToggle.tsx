'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    // modal={false} にしてRadixのスクロールロックを止める。
    // 既定の modal={true} は body に overflow:hidden と「スクロールバー幅ぶんの
    // padding-right」を当てるが、globals.css の html{overflow-x:hidden} により
    // スクロールコンテナが html 側にあるためスクロールバーは消えず、
    // padding だけが効いて中央寄せのコンテンツが左に7.5pxずれていた。
    // 3項目のテーマ切替にページのスクロールロックは不要。
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' aria-label='テーマを切り替える'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' aria-hidden='true' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' aria-hidden='true' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')} aria-current={theme === 'light'}>
          ライト
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} aria-current={theme === 'dark'}>
          ダーク
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} aria-current={theme === 'system'}>
          システム設定に合わせる
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
