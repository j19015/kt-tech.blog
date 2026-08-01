'use client';
import { Fragment } from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export type BreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
};

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbNav = ({ items }: BreadcrumbNavProps) => {
  return (
    <div className='px-4 py-3 lg:px-8 mb-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/' prefetch={false}>
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {/* BreadcrumbList は <ol> なので直下に <div> を置くとHTMLとして不正になり、
              スクリーンリーダーがリストとして認識しなくなる。Fragment で並べる。 */}
          {items.map((item, index) => (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.current ? (
                  <BreadcrumbPage className='truncate max-w-[200px] sm:max-w-[400px]' title={item.label}>
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href || '#'} prefetch={false}>
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};