'use client';

import Link from 'next/link';
import styled from 'styled-components';

export const metadata = {
  title: '404',
};

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  text-align: center;
  color: rgb(var(--foreground-rgb));
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const HomeLink = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1.25rem;
  color: #fff;
  background-color: #007bff;
  border-radius: 0.25rem;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }
`;

export default function Custom404() {
  return (
    <NotFoundContainer>
      <Title>404 - Page Not Found</Title>
      <Text>お探しのページが見つかりませんでした。</Text>
      <Link href='/' passHref>
        <HomeLink>ホームに戻る</HomeLink>
      </Link>
    </NotFoundContainer>
  );
}
