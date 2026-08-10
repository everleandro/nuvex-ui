import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';

import ECard from './index.vue';

describe('ECard', () => {
  it('adds the body grid class when default slot content is present', () => {
    const wrapper = mount(ECard, {
      slots: {
        default: 'Body content',
      },
    });

    expect(wrapper.find('.e-card__main').classes()).toContain('e-card__main--has-body');
  });

  it('does not render the body wrapper when the default slot is absent', () => {
    const wrapper = mount(ECard);

    expect(wrapper.find('.e-card__body').exists()).toBe(false);
    expect(wrapper.find('.e-card__main').classes()).not.toContain('e-card__main--has-body');
  });

  it('adds only the append grid class when body append media is present', () => {
    const wrapper = mount(ECard, {
      props: {
        appendIcon: 'mdi-star',
      },
    });

    expect(wrapper.find('.e-card__main').classes()).toContain('e-card__main--has-append');
    expect(wrapper.find('.e-card__main').classes()).not.toContain('e-card__main--has-prepend');
  });

  it('adds the prepend and header grid classes when body media and header content are present', () => {
    const wrapper = mount(ECard, {
      props: {
        title: 'Card title',
        prependIcon: 'mdi-heart',
      },
    });

    expect(wrapper.find('.e-card__main').classes()).toContain('e-card__main--has-prepend');
    expect(wrapper.find('.e-card__main').classes()).toContain('e-card__main--has-header');
    expect(wrapper.find('.e-card__main').classes()).not.toContain('e-card__main--has-description');
  });

  it('adds only the description grid class when description is present without a header', () => {
    const wrapper = mount(ECard, {
      props: {
        description: 'Card description',
      },
    });

    expect(wrapper.find('.e-card__main').classes()).toContain('e-card__main--has-description');
    expect(wrapper.find('.e-card__main').classes()).not.toContain('e-card__main--has-header');
  });

  it('defaults body media vertical alignment to center', () => {
    const wrapper = mount(ECard, {
      props: {
        prependIcon: 'mdi-heart',
        appendIcon: 'mdi-star',
      },
    });

    expect(wrapper.find('.e-card__main > .e-card__prepend').classes()).toContain('e-card__prepend-center');
    expect(wrapper.find('.e-card__main > .e-card__append').classes()).toContain('e-card__append-center');
  });

  it('renders body prepend media inside card main instead of the header', () => {
    const wrapper = mount(ECard, {
      props: {
        title: 'Card title',
        prependIcon: 'mdi-heart',
      },
    });

    expect(wrapper.find('.e-card__main > .e-card__prepend').exists()).toBe(true);
    expect(wrapper.find('.e-card__header > .e-card__prepend').exists()).toBe(false);
  });

  it('renders header prepend media only from prependHeader props', () => {
    const wrapper = mount(ECard, {
      props: {
        title: 'Card title',
        prependHeaderIcon: 'mdi-heart',
      },
    });

    expect(wrapper.find('.e-card__header > .e-card__prepend').exists()).toBe(true);
    expect(wrapper.find('.e-card__main > .e-card__prepend').exists()).toBe(false);
  });

  it('does not create a header when only body media is provided', () => {
    const wrapper = mount(ECard, {
      props: {
        prependIcon: 'mdi-heart',
        appendIcon: 'mdi-star',
      },
    });

    expect(wrapper.find('.e-card__header').exists()).toBe(false);
    expect(wrapper.find('.e-card__main > .e-card__prepend').exists()).toBe(true);
    expect(wrapper.find('.e-card__main > .e-card__append').exists()).toBe(true);
  });

  it('renders header append media only from appendHeader props', () => {
    const wrapper = mount(ECard, {
      props: {
        title: 'Card title',
        appendHeaderIcon: 'mdi-dots-horizontal',
      },
    });

    expect(wrapper.find('.e-card__header > .e-card__append').exists()).toBe(true);
    expect(wrapper.find('.e-card__main > .e-card__append').exists()).toBe(false);
  });

  it('applies vertical alignment props to body prepend and append media', () => {
    const wrapper = mount(ECard, {
      props: {
        prependIcon: 'mdi-heart',
        appendIcon: 'mdi-star',
        prependVerticalAlign: 'center',
        appendVerticalAlign: 'end',
      },
    });

    expect(wrapper.find('.e-card__main > .e-card__prepend').classes()).toContain('e-card__prepend-center');
    expect(wrapper.find('.e-card__main > .e-card__append').classes()).toContain('e-card__append-end');
  });

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