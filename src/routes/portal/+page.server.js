import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export function load() {
  // Redirect to the external system
  throw redirect(302, 'https://justiceminds-nine.vercel.app/rooms/f21a3397-f125-4360-8093-35e2cb812336');
}
