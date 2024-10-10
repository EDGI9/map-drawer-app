import {it, describe, expect, vi, beforeEach, afterAll} from "vitest";
import {fireEvent, render, cleanup, RenderResult} from '@testing-library/react';
import Button from "../Button"

describe('Button component', () => {
  let component: RenderResult;
  let button: HTMLElement;
 
  const props = {
    text: "Test Text",
    onClick: vi.fn(),
  }

  beforeEach(() => {
    component = render(<Button {...props}/>);
    button = component.getByTestId('qa-button');
  });

  afterAll(() => {
    cleanup();
  });

  it('Componen renders properly', () => {
    expect(button).toBeTruthy();
    expect(button.textContent).toEqual(props.text)
  })

  it('Component handles user events', () => {
    expect(button).toBeTruthy();
    fireEvent.click(button)
    expect(props.onClick).toHaveBeenCalledOnce();
  });
});