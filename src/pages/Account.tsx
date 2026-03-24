import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, MapPin, ShoppingBag, Heart, LogOut, Phone, Mail, CreditCard, PlusCircle, Loader2 } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: User, label: 'Dados Pessoais', key: 'profile' },
  { icon: MapPin, label: 'Endereços', key: 'addresses' },
  { icon: ShoppingBag, label: 'Meus Pedidos', key: 'orders' },
  { icon: Heart, label: 'Favoritos', key: 'favorites' },
] as const;

const emptyAddress = {
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
};

export default function Account() {
  const { currentCustomer, logoutCustomer, getCustomerOrders, addAddress } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'favorites'>('profile');
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressMessage, setAddressMessage] = useState('');

  if (!currentCustomer) {
    return <Navigate to="/login" replace />;
  }

  const orders = getCustomerOrders();

  const submitAddress = async () => {
    setAddressMessage('');
    if (!addressForm.zipCode || !addressForm.street || !addressForm.number || !addressForm.neighborhood || !addressForm.city || !addressForm.state) {
      setAddressMessage('Preencha os campos obrigatórios do endereço.');
      return;
    }

    setSavingAddress(true);
    const result = await addAddress(addressForm);
    setSavingAddress(false);
    setAddressMessage(result.message);

    if (result.ok) {
      setAddressForm(emptyAddress);
    }
  };

  return (
    <div className="py-8 md:py-12">
      <div className="container max-w-5xl">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-light mb-2">Minha Conta</h1>
              <p className="text-sm text-muted-foreground font-body">Gerencie seus dados, pedidos e endereços salvos.</p>
            </div>
            <Button variant="premium-outline" onClick={logoutCustomer}><LogOut className="w-4 h-4" /> Sair</Button>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-[280px,1fr] gap-6">
          <div className="space-y-3">
            {menuItems.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 0.05}>
                <button type="button" onClick={() => setActiveTab(item.key)} className={`flex w-full items-center gap-4 p-5 border transition-colors group ${activeTab === item.key ? 'border-gold bg-gold/5' : 'border-border hover:border-gold'}`}>
                  <item.icon className="w-5 h-5 text-gold" />
                  <span className="text-sm font-body font-medium group-hover:text-gold transition-colors">{item.label}</span>
                </button>
              </ScrollReveal>
            ))}
          </div>

          <div className="space-y-6">
            {activeTab === 'profile' && (
              <>
                <ScrollReveal>
                  <div className="border border-border p-6">
                    <h2 className="text-xs tracking-luxury uppercase font-body font-semibold mb-5">Dados Pessoais</h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm font-body">
                      <div className="border border-border p-4 flex gap-3"><User className="w-4 h-4 text-gold mt-0.5" /><div><p className="text-muted-foreground">Nome</p><p>{currentCustomer.name}</p></div></div>
                      <div className="border border-border p-4 flex gap-3"><Mail className="w-4 h-4 text-gold mt-0.5" /><div><p className="text-muted-foreground">E-mail</p><p>{currentCustomer.email}</p></div></div>
                      <div className="border border-border p-4 flex gap-3"><Phone className="w-4 h-4 text-gold mt-0.5" /><div><p className="text-muted-foreground">Telefone</p><p>{currentCustomer.phone}</p></div></div>
                      <div className="border border-border p-4 flex gap-3"><CreditCard className="w-4 h-4 text-gold mt-0.5" /><div><p className="text-muted-foreground">CPF</p><p>{currentCustomer.cpf || 'Não informado'}</p></div></div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <div className="border border-border p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-xs tracking-luxury uppercase font-body font-semibold">Resumo dos Pedidos</h2>
                      <Link to="/pedidos" className="text-xs text-gold font-body">Ver todos</Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm font-body">
                      <div className="border border-border p-4"><p className="text-muted-foreground">Total de pedidos</p><p className="text-2xl font-display mt-2">{orders.length}</p></div>
                      <div className="border border-border p-4"><p className="text-muted-foreground">Total gasto</p><p className="text-2xl font-display mt-2">R$ {currentCustomer.totalSpent.toFixed(2).replace('.', ',')}</p></div>
                      <div className="border border-border p-4"><p className="text-muted-foreground">Último pedido</p><p className="text-2xl font-display mt-2">{orders[0]?.id || '--'}</p></div>
                    </div>
                  </div>
                </ScrollReveal>
              </>
            )}

            {activeTab === 'addresses' && (
              <ScrollReveal>
                <div className="border border-border p-6 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xs tracking-luxury uppercase font-body font-semibold">Endereços Salvos</h2>
                      <p className="text-sm text-muted-foreground font-body mt-2">Agora você pode clicar aqui e cadastrar novos endereços para compras.</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-body">{currentCustomer.addresses.length} cadastrado(s)</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {currentCustomer.addresses.length > 0 ? currentCustomer.addresses.map((address, index) => (
                      <div key={`${address.zipCode}-${index}`} className="border border-border p-4 text-sm font-body">
                        <p>{address.street}, {address.number}</p>
                        {address.complement && <p>{address.complement}</p>}
                        <p>{address.neighborhood}</p>
                        <p>{address.city} - {address.state}</p>
                        <p>CEP: {address.zipCode}</p>
                      </div>
                    )) : <p className="text-sm text-muted-foreground font-body">Nenhum endereço salvo ainda.</p>}
                  </div>

                  <div className="border border-border p-5 bg-muted/20 space-y-4">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-gold" />
                      <h3 className="text-sm font-semibold font-body">Adicionar novo endereço</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <input value={addressForm.zipCode} onChange={(e) => setAddressForm((prev) => ({ ...prev, zipCode: e.target.value }))} placeholder="CEP *" className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <input value={addressForm.street} onChange={(e) => setAddressForm((prev) => ({ ...prev, street: e.target.value }))} placeholder="Rua *" className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <input value={addressForm.number} onChange={(e) => setAddressForm((prev) => ({ ...prev, number: e.target.value }))} placeholder="Número *" className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <input value={addressForm.complement} onChange={(e) => setAddressForm((prev) => ({ ...prev, complement: e.target.value }))} placeholder="Complemento" className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <input value={addressForm.neighborhood} onChange={(e) => setAddressForm((prev) => ({ ...prev, neighborhood: e.target.value }))} placeholder="Bairro *" className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <input value={addressForm.city} onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))} placeholder="Cidade *" className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <input value={addressForm.state} onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))} placeholder="Estado *" className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background md:col-span-2" />
                    </div>

                    {addressMessage && <p className="text-sm font-body text-muted-foreground">{addressMessage}</p>}

                    <Button variant="premium" onClick={submitAddress} disabled={savingAddress}>
                      {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                      Salvar endereço
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {activeTab === 'orders' && (
              <ScrollReveal>
                <div className="border border-border p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xs tracking-luxury uppercase font-body font-semibold">Meus Pedidos</h2>
                    <Link to="/pedidos" className="text-xs text-gold font-body">Abrir página completa</Link>
                  </div>
                  <div className="space-y-3">
                    {orders.length > 0 ? orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="border border-border p-4 text-sm font-body">
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('pt-BR')} · {order.status}</p>
                        <p className="mt-2">Total: R$ {order.total.toFixed(2).replace('.', ',')}</p>
                      </div>
                    )) : <p className="text-sm text-muted-foreground font-body">Nenhum pedido ainda.</p>}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {activeTab === 'favorites' && (
              <ScrollReveal>
                <div className="border border-border p-6">
                  <h2 className="text-xs tracking-luxury uppercase font-body font-semibold mb-4">Favoritos</h2>
                  <p className="text-sm text-muted-foreground font-body">A lista de favoritos continua disponível na página específica.</p>
                  <Button variant="outline" className="mt-4" asChild><Link to="/favoritos">Abrir favoritos</Link></Button>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
