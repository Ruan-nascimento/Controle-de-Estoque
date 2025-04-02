export type Item = {
  id: string;
  name: string;
  type: string;
  qtd: number;
  value: number;
  flavor:string
  status: string;
};
  
  export const items: Item[] = [
    {
      id: "1",
      name: "Picolé de Chocolate Kibom",
      type: "Sorvete",
      flavor: "Chocolate",
      qtd: 10,
      status: "Bastante",
      value: 10.50
    },
    {
      id: "2",
      name: "Coca-Cola 2L",
      type: "Bebida",
      flavor: "Cola",
      qtd: 5,
      status: "Pouco",
      value: 7.00
    },
    {
      id: "3",
      name: "Sorvete de Baunilha",
      type: "Sorvete",
      flavor: "Baunilha",
      qtd: 8,
      status: "Bastante",
      value: 18.00
    },
  ];