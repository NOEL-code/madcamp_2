import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import NavBar from 'Components/NavBar';
import api from '../../utils/api';  // api 유틸리티 가져오기

const Stat = ({ navigation }) => {
  const today = new Date().toISOString().split('T')[0]; // 현재 날짜를 yyyy-mm-dd 형식으로 가져오기
  const [selected, setSelected] = useState(today);
  const [markedDates, setMarkedDates] = useState({
    [today]: { selected: true, selectedColor: '#03CF5D', dotColor: '#03CF5D', marked: true }
  });

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await api.get('/attendance'); // API 엔드포인트에 맞게 조정
      console.log('API response:', response.data); // 응답 데이터 로그 출력

      // 응답 데이터 구조에 맞게 변경
      const records = response.data.records || [];

      const newMarkedDates = { ...markedDates };

      records.forEach(record => {
        const date = record.date;
        if (newMarkedDates[date]) {
          newMarkedDates[date].marked = true;
          newMarkedDates[date].dotColor = '#03CF5D';
        } else {
          newMarkedDates[date] = { marked: true, dotColor: '#03CF5D' };
        }
      });

      console.log('Updated markedDates:', newMarkedDates); // 마킹된 날짜들 로그 출력
      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const handleDayPress = (day) => {
    const newMarkedDates = {
      ...markedDates,
      [selected]: { marked: markedDates[selected]?.marked || false, dotColor: '#03CF5D' }, // 이전 선택된 날짜의 selected 해제
      [day.dateString]: { selected: true, selectedColor: '#03CF5D', dotColor: '#03CF5D', marked: true } // 새로 선택된 날짜 선택
    };
    setMarkedDates(newMarkedDates);
    setSelected(day.dateString);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.Title}>기록</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            current={today}
            monthFormat={'yyyy년 MM월'}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            markingType={'dot'} // 'dot'을 사용하여 날짜에 점 표시
            theme={{
              dayTextColor: 'black',
              arrowColor: '#03CF5D',
              todayTextColor: '#03CF5D',
              selectedDayTextColor: '#ffffff',
              selectedDayBackgroundColor: '#03CF5D',
            }}
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.timeRow}>
            <Text style={styles.labelText}>출근</Text>
            <Text style={styles.timeText}>10:00:00</Text>
            <Text style={styles.labelText}>퇴근</Text>
            <Text style={styles.timeText}>10:00:00</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={styles.timeSegment}
              />
            </View>
          </View>
          <View style={styles.legendContainer}>
            <View style={[styles.legendDot, { backgroundColor: '#03CF5D' }]} />
            <Text style={styles.legendText}>근무</Text>
            <View style={[styles.legendDot, { backgroundColor: '#5F5F5F' }]} />
            <Text style={styles.legendText}>자리비움</Text>
          </View>
        </View>
      </ScrollView>

      <NavBar navigation={navigation} currentRoute={'Stat'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 80, // To avoid content being hidden by the navbar
  },
  Title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 30,
    marginTop: 40,
  },
  calendarContainer: {
    marginHorizontal: 30,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#03CF5D',
    borderRadius: 15,
    padding: 10,
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalTimeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03CF5D',
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
  },
  progressBarContainer: {
    width: '80%',
    height: 20,
    borderRadius: 10,
    backgroundColor: '#dfdfdf',
    marginBottom: 10,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#dfdfdf',
    position: 'relative',
  },
  timeSegment: {
    position: 'absolute',
    height: '100%',
    borderRadius: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 20,
    height: 8,
    borderRadius: 4,
    margin: 5,
  },
  legendText: {
    fontSize: 16,
    marginRight: 15,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default Stat;
