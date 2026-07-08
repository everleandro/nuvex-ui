import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';

import ECard from './index.vue';

describe('ECard', () => {
  it('adds tonal class when tonal mode is enabled', () => {
    const wrapper = mount(ECard, {
      props: {
        tonal: true,
      },
    });

    expect(wrapper.classes()).toContain('e-card--tonal');
  });

  it('keeps tonal cards flat even when elevation is provided', () => {
    const wrapper = mount(ECard, {
      props: {
        tonal: true,
        elevation: 'lg',
      },
    });

    expect(wrapper.classes()).toContain('e-card--tonal');
    expect(wrapper.classes().some((className) => className.startsWith('e-elevation--'))).toBe(false);
  });

  it('resolves color variables used by tonal cards', () => {
    const wrapper = mount(ECard, {
      props: {
        tonal: true,
        color: 'blue-500',
      },
    });

    const style = wrapper.element.style;

    expect(style.getPropertyValue('--card-color')).toBe('var(--e-palette-blue-500)');
    expect(style.getPropertyValue('--card-contrast-color')).toBe('var(--e-palette-blue-50, white)');
  });
});