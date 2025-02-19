import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({ 
  subsets: ['latin'], // Se a fonte suportar outros alfabetos
  weight: ['400', '700'] // Se a fonte tiver diferentes pesos
});