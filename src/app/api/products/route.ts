import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd(), 'public', 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/products.json', 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading products data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.categories || !Array.isArray(body.categories)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Write to the products.json file
    const jsonDirectory = path.join(process.cwd(), 'public', 'data');
    await fs.writeFile(
      jsonDirectory + '/products.json',
      JSON.stringify(body, null, 2),
      'utf8'
    );

    return NextResponse.json({ message: 'Products data updated successfully' });
  } catch (error) {
    console.error('Error updating products data:', error);
    return NextResponse.json(
      { error: 'Failed to update products data' },
      { status: 500 }
    );
  }
}