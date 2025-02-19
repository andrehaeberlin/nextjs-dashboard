import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!);//, { ssl: 'require' });

interface Invoice {
    amount: number;
    name: string;
}

async function listInvoices(amount?: number): Promise<Invoice[]> {
    try {
        let query = sql`
            SELECT invoices.amount, customers.name
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
        `;

        if (amount) {
            query = sql`
                ${query}
                WHERE invoices.amount = ${amount}
            `;
        }

        const result = await query;
        return result.map(row => ({
            amount: row.amount,
            name: row.name,
        }));

    } catch (error) {
        console.error("Erro ao listar invoices:", error);
        throw new Error("Falha ao acessar o banco de dados.");
    }
}

export async function GET(request: Request) {  // Exporta a função GET
    const url = new URL(request.url);
    const amount = url.searchParams.get('amount') ? parseInt(url.searchParams.get('amount')!) : undefined;

    try {
        const invoices = await listInvoices(amount);
        return new Response(JSON.stringify(invoices), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Teste de Conexão (opcional, pode ser removido)
async function testConnection() {
  try {
    const result = await sql`SELECT 1`;
    console.log('Conexão bem-sucedida:', result);
  } catch (error) {
    console.error('Erro de conexão:', error);
  }
}

testConnection(); // Chamando a função de teste
