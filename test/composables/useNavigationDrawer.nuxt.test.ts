import { describe, it, expect } from 'vitest';

describe('useNavigationDrawer', () => {
  it('should initialize with default values', async () => {
    const { clipped, drawer, isPermanent } = useNavigationDrawer();

    expect(clipped.value).toBe(false);
    expect(drawer.value).toBe(false);
    expect(isPermanent.value).toBe(false);
  });

  it('should toggle the drawer when closeDrawable is called', async () => {
    const { drawer, closeDrawable } = useNavigationDrawer();

    expect(drawer.value).toBe(false);

    await closeDrawable();

    expect(drawer.value).toBe(true);
  });

  it('should toggle the drawer when onClickOutside is called and the drawer is true and isPermanent is false', async () => {
    const { drawer, isPermanent, onClickOutside, closeDrawable } =
      useNavigationDrawer();

    expect(drawer.value).toBe(false);
    expect(isPermanent.value).toBe(false);

    await closeDrawable();

    expect(drawer.value).toBe(true);

    await onClickOutside.value();

    expect(drawer.value).toBe(false);
  });

  it('should not toggle the drawer when onClickOutside is called and the drawer and isPermanent are false', async () => {
    const { drawer, isPermanent, onClickOutside } = useNavigationDrawer();

    expect(drawer.value).toBe(false);
    expect(isPermanent.value).toBe(false);

    await onClickOutside.value();

    expect(drawer.value).toBe(false);
  });

  it('should toggle the clipped state when closeDrawable is called and isPermanent is true', async () => {
    const { clipped, isPermanent, closeDrawable } = useNavigationDrawer(1200);

    expect(clipped.value).toBe(false);
    expect(isPermanent.value).toBe(true);

    await closeDrawable();

    expect(clipped.value).toBe(true);
  });

  it('should toggle the drawer state when closeDrawable is called and isPermanent is true and drawer is false', async () => {
    const { drawer, isPermanent, closeDrawable } = useNavigationDrawer(1200);

    expect(drawer.value).toBe(false);
    expect(isPermanent.value).toBe(true);

    await closeDrawable();

    expect(drawer.value).toBe(true);
  });

  it('should not toggle the drawer state when closeDrawable is called and isPermanent is true and drawer is true', async () => {
    const { drawer, isPermanent, closeDrawable } = useNavigationDrawer(1200);

    expect(drawer.value).toBe(false);
    expect(isPermanent.value).toBe(true);

    await closeDrawable();
    await closeDrawable();

    expect(drawer.value).toBe(true);
  });
});
