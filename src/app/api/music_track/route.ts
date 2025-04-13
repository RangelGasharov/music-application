import pool from '../../../lib/db';

export async function GET() {
    try {
        const { rows } = await pool.query('SELECT * FROM music_track');
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Fehler beim Abrufen der Daten' }), { status: 500 });
    }
}