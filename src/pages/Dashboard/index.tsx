import { useEffect, useState } from 'react';
import { DashboardBackground, BodyContainer, InlineContainer, InlineTitle } from './styles';
import { key, request } from '../../services/resources/pix';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Statement from './Statement';
import useAuth from '../../components/hooks/userAuth';

const Dashboard = () => {
    const {user, getCurrentUser} = useAuth();
    const wallet = user?.wallet || 0;

    const [pay, setKey] = useState(``);
    const [generatedKey, setGeneratedKey] = useState(``);
    const [value, setValue] = useState(``);

    const handleNewPayment = async () => {
        const {data} = await request(Number(value));

        if(data.copyPasteKey) {
            setGeneratedKey(data.copyPasteKey);
        }
    }

    const handlePayPix = async () => {
        try {
            const {data} = await key(pay);
            
            if(data.msg) {
                alert(data.msg);
                return
            }

            alert('Não foi possivel realizar o pagamento.');
        } catch (e) {
            console.log(e);
            alert('Não foi possivel receber o PIX do mesmo usuário!');
        }
    }

    useEffect(() => {
        getCurrentUser();
    })

    if(!user){
        return null
    }

    return (
        <DashboardBackground>
            <Header />
            <BodyContainer>
                <div>
                   <Card noShadow width="90%">
                       <InlineTitle>
                        <h2 className="h2">Saldo Atual</h2>
                       </InlineTitle>
                       <InlineContainer>
                            <h3 className="wallet">
                                {wallet.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                            </h3>
                        </InlineContainer>
                   </Card>
                   <Card noShadow width="90%">
                       <InlineTitle>
                        <h2 className="h2">Receber PIX</h2>
                       </InlineTitle>
                        <InlineContainer>
                            <Input style={{flex: 1}} value={value} onChange={e => setValue(e.target.value)} placeholder="Insira o valor."/>
                            <Button onClick={handleNewPayment}>Gerar código</Button>
                        </InlineContainer>
                        {generatedKey && (
                            <>
                            <p className="primary-color">Pix copia e cola:</p>
                            <p className="primary-color">{generatedKey}</p>                            
                            </>
                        )}
                   </Card>
                   <Card noShadow width="90%">
                        <InlineTitle>
                            <h2 className="h2">Pagar PIX</h2>
                        </InlineTitle>
                        <InlineContainer>
                        <Input style={{flex: 1}} value={pay} onChange={e => setKey(e.target.value)} placeholder="Insira a chave."/>
                        <Button onClick={handlePayPix}>Pagar PIX</Button>
                        </InlineContainer>
                   </Card>
                </div>
                <div>
                    <Card noShadow width="90%">
                      <InlineTitle>
                      <h2 className="h2">Extrato da conta</h2>
                      </InlineTitle>
                      <Statement />
                   </Card>
                </div>
            </BodyContainer>
        </DashboardBackground>
    )
}

export default Dashboard