import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function App() {
  const despesas = [
    { label: 'Alimentação', valor: 'R$ 1.400', pct: 40, cor: '#17B978' },
    { label: 'Moradia', valor: 'R$ 1.050', pct: 30, cor: '#4361EE' },
    { label: 'Lazer', valor: 'R$ 525', pct: 15, cor: '#F72585' },
    { label: 'Outros', valor: 'R$ 525', pct: 15, cor: '#FF9F1C' },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.headerTitle}>Minhas Finanças</Text>

          {/* Card de Despesas */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Distribuição de Despesas</Text>

            {/* Totalizador */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Gasto</Text>
              <Text style={styles.totalValue}>R$ 3.500,00</Text>
            </View>

            {/* Barra Proporcional (Gráfico em Estilo) */}
            <View style={styles.progressContainer}>
              {despesas.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressSegment,
                    {
                      flex: item.pct,
                      backgroundColor: item.cor,
                      borderTopLeftRadius: index === 0 ? 8 : 0,
                      borderBottomLeftRadius: index === 0 ? 8 : 0,
                      borderTopRightRadius: index === despesas.length - 1 ? 8 : 0,
                      borderBottomRightRadius: index === despesas.length - 1 ? 8 : 0,
                    },
                  ]}
                />
              ))}
            </View>

            {/* Lista com Porcentagens e Barras Individuais */}
            <View style={styles.listContainer}>
              {despesas.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.listHeader}>
                    <View style={styles.labelGroup}>
                      <View style={[styles.colorBadge, { backgroundColor: item.cor }]} />
                      <Text style={styles.itemLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.itemValue}>
                      {item.valor} <Text style={styles.itemPct}>({item.pct}%)</Text>
                    </Text>
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
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
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
});
