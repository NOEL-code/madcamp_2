import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

const StatisticsScreen = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const onDateChange = date => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>기록</Text>
      </View>
      <ScrollView>
        <View style={styles.calendarContainer}>
          <CalendarPicker
            onDateChange={onDateChange}
            previousTitle="Previous"
            nextTitle="Next"
            todayBackgroundColor="#03CF5D"
            selectedDayColor="#03CF5D"
            selectedDayTextColor="#FFFFFF"
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsDate}>
            {selectedDate
              ? selectedDate.format('YYYY년 M월 D일')
              : '2024년 5월 1일'}
          </Text>
          <Text style={styles.totalTime}>총 0 시간 00 분</Text>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>출근</Text>
            <Text style={styles.timeValue}>11:00:37</Text>
            <Text style={styles.timeSeparator}>~</Text>
            <Text style={styles.timeLabel}>퇴근</Text>
            <Text style={styles.timeValue}>13:00:24</Text>
          </View>
          <View style={styles.statusRow}>
            <View
              style={[styles.statusIndicator, {backgroundColor: '#03CF5D'}]}
            />
            <Text style={styles.statusLabel}>근무</Text>
            <View
              style={[
                styles.statusIndicator,
                {backgroundColor: '#D9D9D9', marginLeft: 10},
              ]}
            />
            <Text style={styles.statusLabel}>자리 비움</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('Statistic')}>
          <Image
            source={require('./assets/images/statistics.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image
            source={require('./assets/images/HomeNotSelected.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('./assets/images/myPageNotSelected.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendarContainer: {
    padding: 20,
  },
  detailsContainer: {
    padding: 20,
  },
  detailsDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalTime: {
    fontSize: 24,
    color: '#03CF5D',
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeLabel: {
    fontSize: 16,
    color: '#000',
  },
  timeValue: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
    marginRight: 10,
  },
  timeSeparator: {
    fontSize: 16,
    color: '#000',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default StatisticsScreen;
