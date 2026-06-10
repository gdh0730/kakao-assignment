import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App.jsx';
import { formatDateKey } from './lib/dateUtils.js';
import { STORAGE_KEY } from './lib/todoUtils.js';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates, completes, edits, and deletes a todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('할 일 입력'), 'React 마이그레이션');
    await user.click(screen.getByRole('button', { name: '추가' }));
    expect(screen.getByText('React 마이그레이션')).toBeTruthy();

    await user.click(screen.getByLabelText('React 마이그레이션 완료 상태 변경'));
    expect(screen.getByText('완료 상태가 변경되었습니다.')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: '수정' }));
    const editInput = screen.getByLabelText('Todo 수정 입력');
    await user.clear(editInput);
    await user.type(editInput, 'React 리팩토링 완료');
    await user.click(screen.getByRole('button', { name: '저장' }));
    expect(screen.getByText('React 리팩토링 완료')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: '삭제' }));
    expect(screen.queryByText('React 리팩토링 완료')).toBeNull();
  });

  it('shows an empty-input message and preserves localStorage data', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '추가' }));
    expect(screen.getByText('할 일을 입력한 뒤 추가해주세요.')).toBeTruthy();

    await user.type(screen.getByLabelText('할 일 입력'), '저장 확인');
    await user.click(screen.getByRole('button', { name: '추가' }));
    const storedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(storedTodos[0].text).toBe('저장 확인');
  });

  it('filters and paginates visible todos', async () => {
    const user = userEvent.setup();
    const todayDate = formatDateKey(new Date());
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        Array.from({ length: 6 }, (_, index) => ({
          id: `todo-${index}`,
          text: `할 일 ${index + 1}`,
          completed: index === 0,
          date: todayDate,
          createdAt: `2026-06-10T0${index}:00:00.000Z`,
          updatedAt: `2026-06-10T0${index}:00:00.000Z`,
        }))
      )
    );

    render(<App />);
    expect(screen.getByText('1 / 2')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: '다음' }));
    expect(screen.getByText('할 일 1')).toBeTruthy();

    await user.click(screen.getByRole('tab', { name: '완료' }));
    expect(screen.getByText('1 / 1')).toBeTruthy();
    expect(screen.getByText('할 일 1')).toBeTruthy();
  });

  it('shows date badges in all-todo view', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'future',
          text: '다른 날짜 Todo',
          completed: false,
          date: '2026-06-11',
          createdAt: '2026-06-11T01:00:00.000Z',
          updatedAt: '2026-06-11T01:00:00.000Z',
        },
      ])
    );

    render(<App />);
    await user.click(screen.getByRole('button', { name: '전체 Todo' }));

    const item = screen.getByText('다른 날짜 Todo').closest('li');
    expect(within(item).getByText(/2026년 6월 11일/)).toBeTruthy();
  });
});
