import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ListRenderItem,
} from "react-native";

interface MyListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListEmptyComponent?: React.ReactElement | null;
  keyboardShouldPersistTaps?: any
}

export default function MyList<T>({
  data,
  renderItem,
  keyExtractor,
  refreshing = false,
  onRefresh,
  ListEmptyComponent,
  keyboardShouldPersistTaps
}: MyListProps<T>) {
  return (
    <FlatList<T>
      data={data}
      renderItem={renderItem}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      keyExtractor={keyExtractor ?? ((_, index) => index.toString())}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      ListEmptyComponent={
        ListEmptyComponent ?? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No data found</Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});
