import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const STORAGE_KEY = '@financas_grafico_despesas';

// Palette de cores vibrantes para usar dinamicamente nas despesas
const PALETA_CORES = [
  '#17B978', // Verde
  '#4361EE', // Azul
  '#F72585', // Rosa
  '#FF9F1C', // Laranja
  '#7209B7', // Roxo
  '#4CC9F0', // Ciano
  '#E63946', // Vermelho
];

export default function App() {
  const [listaDespesas, setListaDespesas] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [valorInput, setValorInput] = useState('');

  // 1. Carregar dados ao iniciar
  useEffect(() => {
    carregarDados();
  }, []);

  // 2. Salvar automaticamente quando a lista mudar
  useEffect(() => {
    salvarDados(listaDespesas);
  }, [listaDespesas]);

  const carregarDados = async () => {
    try {
      const dados = await AsyncStorage.getItem(STORAGE_KEY);
      if (dados !== null) {
        setListaDespesas(JSON.parse(dados));
      }
    } catch (e) {
      Alert.alert('Erro', 'Falha ao carregar as despesas.');
    }
  };

  const salvarDados = async (dados) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    } catch (e) {
      Alert.alert('Erro', 'Falha ao salvar as despesas.');
    }
  };

  // 3. Adicionar nova despesa
  const adicionarDespesa = () => {
    if (!descricao.trim() || !valorInput.trim()) {
      Alert.alert('Atenção', 'Preencha a descrição e o valor.');
      return;
    }

    const valorNumerico = parseFloat(valorInput.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Informe um valor numérico válido.');
      return;
    }

    // Seleciona uma cor da paleta baseada no tamanho da lista
    const cor = PALETA_CORES[listaDespesas.length % PALETA_CORES.length];

    const novaDespesa = {
      id: Date.now().toString(),
      label: descricao.trim(),
      valor: valorNumerico,
      cor: cor,
    };

    setListaDespesas([novaDespesa, ...listaDespesas]);
    setDescricao('');
    setValorInput('');
  };

  // 4. Remover despesa
  const removerDespesa = (id) => {
    setListaDespesas(listaDespesas.filter((item) => item.id !== id));
  };

  // 5. Cálculos Dinâmicos
  const totalGasto = listaDespesas.reduce((acc, item) => acc + item.valor, 0);

  // Mapeia a lista adicionando o calculo da porcentagem proporcional (%)
  const despesasComPorcentagem = listaDespesas.map((item) => {
    const pct = totalGasto > 0 ? (item.valor / totalGasto) * 100 : 0;
    return {
      ...item,
      pct: pct,
      pctFormatada: pct.toFixed(1),
    };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Minhas Finanças</Text>

        {/* Form para Cadastrar Despesas */}
        <View style={styles.cardForm}>
          <Text style={styles.formTitle}>Nova Despesa</Text>
          <TextInput
            style={styles.input}
            placeholder="Descrição (ex: Alimentação)"
            placeholderTextColor="#71717A"
            value={descricao}
            onChangeText={setDescricao}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor (R$) (ex: 150.50)"
            placeholderTextColor="#71717A"
            keyboardType="numeric"
            value={valorInput}
            onChangeText={setValorInput}
          />
          <TouchableOpacity style={styles.botao} onPress={adicionarDespesa}>
            <Text style={styles.textoBotao}>Adicionar ao Gráfico</Text>
          </TouchableOpacity>
        </View>

        {/* Card de Gráfico de Despesas */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Distribuição de Despesas</Text>

          {/* Totalizador */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Gasto</Text>
            <Text style={styles.totalValue}>
              R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>

          {/* Barra Proporcional (Gráfico Principal) */}
          <View style={styles.progressContainer}>
            {despesasComPorcentagem.length === 0 ? (
              <View style={[styles.progressSegment, { flex: 1, backgroundColor: '#2A2A36' }]} />
            ) : (
              despesasComPorcentagem.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.progressSegment,
                    {
                      flex: item.pct,
                      backgroundColor: item.cor,
                      borderTopLeftRadius: index === 0 ? 8 : 0,
                      borderBottomLeftRadius: index === 0 ? 8 : 0,
                      borderTopRightRadius: index === despesasComPorcentagem.length - 1 ? 8 : 0,
                      borderBottomRightRadius: index === despesasComPorcentagem.length - 1 ? 8 : 0,
                    },
                  ]}
                />
              ))
            )}
          </View>

          {/* Lista com Porcentagens e Barras Individuais */}
          <View style={styles.listContainer}>
            {despesasComPorcentagem.length === 0 ? (
              <Text style={styles.vazioText}>Nenhuma despesa cadastrada ainda.</Text>
            ) : (
              despesasComPorcentagem.map((item) => (
                <View key={item.id} style={styles.listItem}>
                  <View style={styles.listHeader}>
                    <View style={styles.labelGroup}>
                      <View style={[styles.colorBadge, { backgroundColor: item.cor }]} />
                      <Text style={styles.itemLabel}>{item.label}</Text>
                    </View>
                    <View style={styles.valueGroup}>
                      <Text style={styles.itemValue}>
                        R$ {item.valor.toFixed(2)}{' '}
                        <Text style={styles.itemPct}>({item.pctFormatada}%)</Text>
                      </Text>
                      <TouchableOpacity onPress={() => removerDespesa(item.id)}>
                        <Text style={styles.deletarBtn}> ✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Barra de progresso individual */}
                  <View style={styles.individualTrack}>
                    <View
                      style={[
                        styles.individualBar,
                        { width: `${item.pct}%`, backgroundColor: item.cor },
                      ]}
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121214',
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 16,
  },
  /* Card do Formulário */
  cardForm: {
    width: width - 32,
    backgroundColor: '#1E1E26',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#121214',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2A2A36',
  },
  botao: {
    backgroundColor: '#17B978',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  /* Card do Gráfico */
  card: {
    width: width - 32,
    backgroundColor: '#1E1E26',
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  totalContainer: {
    marginVertical: 12,
  },
  totalLabel: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  /* Barra Segregada Proporcional */
  progressContainer: {
    height: 16,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#2A2A36',
    borderRadius: 8,
    marginVertical: 16,
    overflow: 'hidden',
  },
  progressSegment: {
    height: '100%',
  },
  /* Lista de Detalhes */
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    marginBottom: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  itemLabel: {
    color: '#E4E4E7',
    fontSize: 14,
    fontWeight: '500',
  },
  itemValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  itemPct: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  deletarBtn: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  individualTrack: {
    height: 6,
    width: '100%',
    backgroundColor: '#2A2A36',
    borderRadius: 3,
    overflow: 'hidden',
  },
  individualBar: {
    height: '100%',
    borderRadius: 3,
  },
  vazioText: {
    color: '#71717A',
    textAlign: 'center',
    marginVertical: 12,
  },
});