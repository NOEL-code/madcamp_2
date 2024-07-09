import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import NavBar from 'Components/NavBar';
import api from '../../utils/api';  // api 유틸리티 가져오기

const getMarkedDates = (workDays, selected) => {
  const markedDates = {};
  workDays.forEach(day => {
    markedDates[day.date] = { dots: [{ key: 'work', color: '#03CF5D' }] };
  });
  if (selected) {
    markedDates[selected] = {
      ...markedDates[selected],
      selected: true,
      selectedColor: '#03CF5D',
    };
  }
  return markedDates;
};

const calculateTotalTime = (date, on, off, away) => {
  const onTime = new Date(`${date}T${on}`);
  let offTime = off ? new Date(`${date}T${off}`) : new Date();
  
  // 현재 시간을 KST로 변환
  if (!off) {
    offTime.setHours(offTime.getHours() + 9);
  }

  console.log(`onTime: ${onTime}, offTime: ${offTime}`);

  const totalAwayTime = away.reduce((total, period) => {
    const awayTime = new Date(`${date}T${period.start}`);
    const comebackTime = period.end ? new Date(`${date}T${period.end}`) : new Date();
    
    // 복귀 시간이 없는 경우 현재 시간으로 설정 (KST 변환 포함)
    if (!period.end) {
      comebackTime.setHours(comebackTime.getHours() + 9);
    }
    
    console.log(`awayTime: ${awayTime}, comebackTime: ${comebackTime}`);
    return total + (comebackTime - awayTime);
  }, 0);

  const totalTime = offTime - onTime - totalAwayTime;
  console.log(`totalTime: ${totalTime}, totalAwayTime: ${totalAwayTime}`);
  
  const hours = Math.floor(totalTime / (1000 * 60 * 60));
  const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));

  // 마이너스 값이 나오는 경우 0으로 처리
  const result = `${Math.max(0, hours)}시간 ${Math.max(0, minutes)}분`;
  console.log(`Total Time: ${result}`);
  return result;
};
const calculatePercentage = time => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
  const nineAMInSeconds = 9 * 3600; // 9 AM in seconds
  const dayDurationInSeconds = 15 * 3600; // From 9 AM to midnight (15 hours)

  const adjustedTimeInSeconds = timeInSeconds - nineAMInSeconds;
  return (adjustedTimeInSeconds / dayDurationInSeconds) * 100;
};

const Stat = ({ navigation }) => {
  const today = new Date().toISOString().split('T')[0]; // 현재 날짜를 yyyy-mm-dd 형식으로 가져오기
  const [selected, setSelected] = useState(today);
  const [selectedWorkDay, setSelectedWorkDay] = useState(null);
  const [workDays, setWorkDays] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get(`/attendance`);
        const attendanceData = response.data;

        const formattedWorkDays = attendanceData.map(record => ({
          date: record.date,
          on: record.arriveTime,
          off: record.departTime,
          away: record.leave.map(leaveRecord => ({
            start: leaveRecord.goOut,
            end: leaveRecord.comeBack,
          })),
        }));

        setWorkDays(formattedWorkDays);
        const todayWorkDay = formattedWorkDays.find(workDay => workDay.date === today);
        setSelectedWorkDay(todayWorkDay || null);
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
      }
    };

    fetchAttendance();
  }, [today]);

  const handleDayPress = day => {
    setSelected(day.dateString);
    const workDay = workDays.find(workDay => workDay.date === day.dateString);
    setSelectedWorkDay(workDay || null);
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
            markingType={'multi-dot'}
            markedDates={getMarkedDates(workDays, selected)}
            theme={{
              dayTextColor: 'black',
              arrowColor: '#03CF5D',
              todayTextColor: '#03CF5D',
              selectedDayTextColor: '#ffffff',
            }}
          />
        </View>

        <View style={styles.detailsContainer}>
          {selectedWorkDay ? (
            <>
              <Text style={styles.dateText}>
                {new Date(selectedWorkDay.date).toLocaleDateString()}
              </Text>
              <Text style={styles.totalTimeText}>
                총{' '}
                {calculateTotalTime(
                  selectedWorkDay.date,
                  selectedWorkDay.on,
                  selectedWorkDay.off,
                  selectedWorkDay.away,
                )}
              </Text>
              <View style={styles.timeRow}>
                <Text style={styles.labelText}>출근</Text>
                <Text style={styles.timeText}>{selectedWorkDay.on}</Text>
                <Text style={styles.labelText}>퇴근</Text>
                <Text style={styles.timeText}>{selectedWorkDay.off || '-'}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  {/* 출근부터 첫 외출 전까지 */}
                  {selectedWorkDay.away.length > 0 && (
                    <View
                      style={[
                        styles.timeSegment,
                        {
                          left: `${calculatePercentage(selectedWorkDay.on)}%`,
                          width: `${
                            calculatePercentage(selectedWorkDay.away[0].start) -
                            calculatePercentage(selectedWorkDay.on)
                          }%`,
                          backgroundColor: '#03CF5D',
                        },
                      ]}
                    />
                  )}
                  {/* 외출 복귀 후 다음 외출 전까지 */}
                  {selectedWorkDay.away.map((period, index) => (
                    <React.Fragment key={index}>
                      <View
                        style={[
                          styles.timeSegment,
                          {
                            left: `${calculatePercentage(period.start)}%`,
                            width: `${
                              calculatePercentage(period.end || new Date().toTimeString().split(' ')[0]) -
                              calculatePercentage(period.start)
                            }%`,
                            backgroundColor: '#DFDFDF',
                          },
                        ]}
                      />
                      {index < selectedWorkDay.away.length - 1 ? (
                        <View
                          style={[
                            styles.timeSegment,
                            {
                              left: `${calculatePercentage(period.end || new Date().toTimeString().split(' ')[0])}%`,
                              width: `${
                                calculatePercentage(
                                  selectedWorkDay.away[index + 1].start,
                                ) - calculatePercentage(period.end || new Date().toTimeString().split(' ')[0])
                              }%`,
                              backgroundColor: '#03CF5D',
                            },
                          ]}
                        />
                      ) : (
                        <View
                          style={[
                            styles.timeSegment,
                            {
                              left: `${calculatePercentage(period.end || new Date().toTimeString().split(' ')[0])}%`,
                              width: `${
                                calculatePercentage(selectedWorkDay.off || new Date().toTimeString().split(' ')[0]) -
                                calculatePercentage(period.end || new Date().toTimeString().split(' ')[0])
                              }%`,
                              backgroundColor: '#03CF5D',
                            },
                          ]}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.dateText}>
                {new Date(selected).toLocaleDateString()}
              </Text>
              <Text style={styles.totalTimeText}>총 0시간 00분</Text>
              <View style={styles.timeRow}>
                <Text style={styles.labelText}>출근</Text>
                <Text style={styles.timeText}>-</Text>
                <Text style={styles.labelText}>퇴근</Text>
                <Text style={styles.timeText}>-</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar} />
              </View>
            </>
          )}
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
