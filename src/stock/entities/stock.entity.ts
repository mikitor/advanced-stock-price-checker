import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  symbol: string;

  @Column({ type: 'float' })
  price: number;

  @CreateDateColumn()
  createdAt: Date;
}
