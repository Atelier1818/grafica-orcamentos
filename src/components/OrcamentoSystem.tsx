import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrcamentoSystem = () => {
  const [priceConfig, setPriceConfig] = useState({
    products: {
      business_card: {
        name: 'Cartão de Visita',
        basePrice: 50,
        priceBySize: false
      },
      flyer: {
        name: 'Flyer',
        basePrice: 100,
        priceBySize: true
      },
      poster: {
        name: 'Poster',
        basePrice: 200,
        priceBySize: true
      }
    },
    papers: {
      offset90: { name: 'Offset 90g', multiplier: 1 },
      couche150: { name: 'Couché 150g', multiplier: 1.5 },
      couche300: { name: 'Couché 300g', multiplier: 2 }
    },
    quantities: {
      100: 1,
      250: 0.8,
      500: 0.7,
      1000: 0.6,
      1500: 0.55,
      2000: 0.5
    },
    extras: {
      margin: 10,
      tax: 23
    }
  });

  const [formData, setFormData] = useState({
    product: '',
    paper: '',
    quantity: 0
  });

  const [quote, setQuote] = useState(null);

  const calculateQuote = () => {
    if (!formData.product || !formData.paper || !formData.quantity) {
      alert('Por favor preencha todos os campos obrigatórios');
      return;
    }

    const product = priceConfig.products[formData.product];
    const paper = priceConfig.papers[formData.paper];
    
    let basePrice = product.basePrice * paper.multiplier;
    
    // Aplica desconto por quantidade
    let discount = 1;
    Object.entries(priceConfig.quantities)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([qty, disc]) => {
        if (formData.quantity >= Number(qty)) {
          discount = disc;
        }
      });

    let price = basePrice * (formData.quantity / 100) * discount;
    
    // Aplica margem
    const withMargin = price * (1 + priceConfig.extras.margin / 100);
    const tax = withMargin * (priceConfig.extras.tax / 100);

    setQuote({
      basePrice: price.toFixed(2),
      margin: (withMargin - price).toFixed(2),
      tax: tax.toFixed(2),
      total: (withMargin + tax).toFixed(2),
      perUnit: (withMargin / formData.quantity).toFixed(3)
    });
  };

  return (
    <Tabs defaultValue="quote" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="quote">Orçamentos</TabsTrigger>
        <TabsTrigger value="admin">Administração</TabsTrigger>
      </TabsList>

      <TabsContent value="quote">
        <Card>
          <CardHeader>
            <CardTitle>Calculadora de Orçamentos</CardTitle>
            <CardDescription>Preencha os detalhes do trabalho</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Produto</Label>
                <Select onValueChange={(v) => setFormData({...formData, product: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priceConfig.products).map(([id, product]) => (
                      <SelectItem key={id} value={id}>{product.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input 
                  type="number"
                  placeholder="Ex: 1000"
                  onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Papel</Label>
              <Select onValueChange={(v) => setFormData({...formData, paper: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o papel" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priceConfig.papers).map(([id, paper]) => (
                    <SelectItem key={id} value={id}>{paper.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full"
              onClick={calculateQuote}
            >
              Calcular Orçamento
            </Button>

            {quote && (
              <Card>
                <CardHeader>
                  <CardTitle>Orçamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Preço base:</span>
                      <span>€{quote.basePrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Margem ({priceConfig.extras.margin}%):</span>
                      <span>€{quote.margin}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IVA ({priceConfig.extras.tax}%):</span>
                      <span>€{quote.tax}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>€{quote.total}</span>
                    </div>
                    <div className="pt-2 text-sm text-gray-500">
                      <p>Preço por unidade: €{quote.perUnit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="admin">
        <Card>
          <CardHeader>
            <CardTitle>Painel de Administração</CardTitle>
            <CardDescription>Configure os preços base e multiplicadores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Produtos */}
            <div>
              <h3 className="text-lg font-medium mb-4">Produtos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(priceConfig.products).map(([id, product]) => (
                  <Card key={id}>
                    <CardHeader>
                      <CardTitle className="text-base">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Preço Base (100 un)</Label>
                        <Input 
                          type="number"
                          value={product.basePrice}
                          onChange={(e) => setPriceConfig(prev => ({
                            ...prev,
                            products: {
                              ...prev.products,
                              [id]: {
                                ...prev.products[id],
                                basePrice: Number(e.target.value)
                              }
                            }
                          }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Papéis */}
            <div>
              <h3 className="text-lg font-medium mb-4">Papéis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(priceConfig.papers).map(([id, paper]) => (
                  <Card key={id}>
                    <CardHeader>
                      <CardTitle className="text-base">{paper.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Multiplicador</Label>
                        <Input 
                          type="number"
                          step="0.1"
                          value={paper.multiplier}
                          onChange={(e) => setPriceConfig(prev => ({
                            ...prev,
                            papers: {
                              ...prev.papers,
                              [id]: {
                                ...prev.papers[id],
                                multiplier: Number(e.target.value)
                              }
                            }
                          }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Descontos por quantidade */}
            <div>
              <h3 className="text-lg font-medium mb-4">Descontos por Quantidade</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {Object.entries(priceConfig.quantities).map(([qty, discount]) => (
                  <Card key={qty}>
                    <CardHeader>
                      <CardTitle className="text-base">{qty} un</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Multiplicador</Label>
                        <Input 
                          type="number"
                          step="0.1"
                          min="0"
                          max="1"
                          value={discount}
                          onChange={(e) => setPriceConfig(prev => ({
                            ...prev,
                            quantities: {
                              ...prev.quantities,
                              [qty]: Number(e.target.value)
                            }
                          }))}
                        />
                        <p className="text-sm text-gray-500">
                          {((1 - discount) * 100).toFixed(0)}% desconto
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default OrcamentoSystem;