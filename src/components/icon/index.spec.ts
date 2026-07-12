import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

import EIcon from './index.vue';

describe('EIcon', () => {
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