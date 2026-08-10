import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

import { iconFontInjectionKey, normalizeIconFontOptions } from './config';
import EIcon from './index.vue';

describe('EIcon', () => {
  it('renders class-based icons immediately with the default font strategy', () => {
    const wrapper = mount(EIcon, {
      props: {
        icon: 'home',
      },
    });

    expect(wrapper.find('i').exists()).toBe(true);
    expect(wrapper.classes()).toContain('e-icon');
    expect(wrapper.classes()).toContain('icon');
    expect(wrapper.classes()).toContain('icon-home');
  });

  it('uses injected icon font resolvers for string icons', () => {
    const wrapper = mount(EIcon, {
      props: {
        icon: 'house',
      },
      global: {
        provide: {
          [iconFontInjectionKey as symbol]: normalizeIconFontOptions({
            baseClass: 'fa',
            resolveClass: (iconName) => ['fa-solid', `fa-${iconName}`],
          }),
        },
      },
    });

    expect(wrapper.classes()).toContain('e-icon');
    expect(wrapper.classes()).toContain('fa');
    expect(wrapper.classes()).toContain('fa-solid');
    expect(wrapper.classes()).toContain('fa-house');
  });

  it('prefers the prop prefix over the injected icon font resolver', () => {
    const wrapper = mount(EIcon, {
      props: {
        icon: 'account',
        prefix: 'mdi-',
      },
      global: {
        provide: {
          [iconFontInjectionKey as symbol]: normalizeIconFontOptions({
            baseClass: 'fa',
            resolveClass: (iconName) => ['fa-solid', `fa-${iconName}`],
          }),
        },
      },
    });

    expect(wrapper.classes()).toContain('fa');
    expect(wrapper.classes()).toContain('mdi-account');
    expect(wrapper.classes()).not.toContain('fa-account');
  });

  it('forwards native path attributes while resolving framework fill tokens', async () => {
    const wrapper = mount(EIcon, {
      props: {
        icon: {
          d: 'M12,2L2,22H22Z',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          fill: 'primary',
        },
      },
    });

    await nextTick();

    const path = wrapper.find('path');

    expect(path.attributes('d')).toBe('M12,2L2,22H22Z');
    expect(path.attributes('stroke')).toBe('currentColor');
    expect(path.attributes('stroke-width')).toBe('1.5');
    expect(path.attributes('stroke-linecap')).toBe('round');
    expect(path.attributes('fill')).toBeUndefined();
    expect(path.attributes('style')).toContain('fill: var(--e-color-primary);');
  });

  it('forwards already-native svg attribute keys without renaming them', async () => {
    const wrapper = mount(EIcon, {
      props: {
        icon: {
          d: 'M12,2L2,22H22Z',
          pathLength: 24,
          'stroke-width': 2,
        },
      },
    });

    await nextTick();

    const path = wrapper.find('path');

    expect(path.attributes('pathLength')).toBe('24');
    expect(path.attributes('stroke-width')).toBe('2');
  });
});